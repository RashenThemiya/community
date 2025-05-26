import 'dart:convert';

import 'package:blue_thermal_printer/blue_thermal_printer.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SanitationTicketingPage extends StatefulWidget {
  @override
  _SanitationTicketingPageState createState() =>
      _SanitationTicketingPageState();
}

class _SanitationTicketingPageState extends State<SanitationTicketingPage> {
  double _ticketPrice = 20.0;
  bool _isLoading = false;
  bool _isPrinting = false;
  bool _testPrinted = false;
  String? _responseMessage;

  final BlueThermalPrinter bluetooth = BlueThermalPrinter.instance;
  List<BluetoothDevice> _devices = [];
  BluetoothDevice? _selectedDevice;

  @override
  void initState() {
    super.initState();
    _initBluetooth();
  }

  Future<void> _initBluetooth() async {
    try {
      List<BluetoothDevice> devices = await bluetooth.getBondedDevices();
      BluetoothDevice? pt210Device;

      for (var device in devices) {
        if ((device.name?.toLowerCase().contains('pt') ?? false) ||
            (device.name?.toLowerCase().contains('printer') ?? false)) {
          pt210Device = device;
          break;
        }
      }

      setState(() {
        _devices = devices;
        _selectedDevice = pt210Device;
      });

      if (pt210Device != null) {
        bool? connected = await bluetooth.isConnected;
        if (connected != true) {
          await bluetooth.connect(pt210Device);
          await Future.delayed(Duration(seconds: 1));
        }

        if (!_testPrinted) {
          await _printTestLabel();
          _testPrinted = true;
        }

        setState(() {
          _responseMessage = '✅ Connected to ${pt210Device?.name ?? 'PT210'}';
        });
      } else {
        setState(() {
          _responseMessage =
              '❌ PT210 printer not found. Pair it in Bluetooth settings.';
        });
      }
    } catch (e) {
      setState(() {
        _responseMessage = 'Bluetooth error: $e';
      });
    }
  }

  Future<void> _printTestLabel() async {
    try {
      bluetooth.write("\n\n");
      bluetooth.write("**** PT210 Printer Connected ****\n");
      bluetooth.write("Test Print Successful\n");
      bluetooth.write("==============================\n\n\n");
    } catch (e) {
      setState(() {
        _responseMessage = '❌ Test print failed: $e';
      });
    }
  }

  Future<void> _issueAndPrintTicket() async {
    setState(() {
      _isLoading = true;
      _responseMessage = null;
    });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final url = Uri.parse('http://3.108.254.92:5000/api/sanitation/');

    try {
      final now = DateTime.now().toUtc().add(Duration(hours: 5, minutes: 30));

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'price': _ticketPrice}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        await _printTicket(data['ticket'], ticketId: data['ticketId'].toString());
        setState(() {
          _responseMessage =
              '✅ Ticket issued and printed (ID: ${data['ticketId']})';
        });
      } else {
        setState(() {
          _responseMessage = data['message'] ?? 'Ticket issue failed.';
        });
      }
    } catch (e) {
      setState(() {
        _responseMessage = 'Error issuing ticket: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _printTicket(Map<String, dynamic> ticket,
      {String? ticketId}) async {
    setState(() => _isPrinting = true);

    try {
      bool? connected = await bluetooth.isConnected;
      if (!connected! && _selectedDevice != null) {
        await bluetooth.connect(_selectedDevice!);
        await Future.delayed(Duration(seconds: 1));
      }

      final now = DateTime.now().toUtc().add(Duration(hours: 5, minutes: 30));
      final formattedDate = DateFormat('yyyy-MM-dd').format(now);
      final formattedTime = DateFormat('HH:mm').format(now);

      String centerText(String text, int lineWidth) {
        int padding = ((lineWidth - text.length) / 2).floor();
        return ' ' * padding + text;
      }

      bluetooth.write("\n\n");
      bluetooth.write(centerText("Dambulla Dedicated", 32) + '\n');
      bluetooth.write(centerText("Economic Center", 32) + '\n');
      bluetooth.write(centerText("Tel- 066 2285181", 32) + '\n');
      bluetooth.write(centerText("Web - dambulladec.com", 32) + '\n');
      bluetooth.write('\n');
      bluetooth.write(centerText("= SANITATION TICKET =", 32) + '\n');
      bluetooth.write("Ticket ID  : ${ticketId ?? ''}\n");
      bluetooth.write("Price      : Rs. ${ticket['price'] ?? ''}\n");
      bluetooth.write("Date       : $formattedDate\n");
      bluetooth.write("Time       : $formattedTime\n");
      bluetooth.write("Issued By  : ${ticket['byWhom'] ?? ''}\n");
      bluetooth.write("============================\n\n\n");
    } catch (e) {
      setState(() {
        _responseMessage = '❌ Printing failed: $e';
      });
    } finally {
      setState(() => _isPrinting = false);
    }
  }

  // ✅ This is the correct location for the helper function
  void _issueTicket(double price) {
    setState(() {
      _ticketPrice = price;
    });
    _issueAndPrintTicket();
  }

  @override
  void dispose() {
    bluetooth.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Sanitation Ticket')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            DropdownButton<BluetoothDevice>(
              value: _selectedDevice,
              hint: Text("Select Printer"),
              items: _devices.map((device) {
                return DropdownMenuItem(
                  value: device,
                  child: Text(device.name ?? device.address ?? 'Unknown'),
                );
              }).toList(),
              onChanged: (device) => setState(() => _selectedDevice = device),
            ),
            SizedBox(height: 20),
            if (_isLoading)
              CircularProgressIndicator()
            else ...[
                            ElevatedButton.icon(
                onPressed: _isPrinting ? null : () => _issueTicket(20),
                icon: Icon(Icons.local_printshop, size: 28), // 🔹 Larger icon
                label: Text(
                  'Issue Ticket (LKR 20)',
                  style: TextStyle(fontSize: 18,  color: Colors.white,),  // 🔹 Larger font
                ),
                style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF00BCD4), // Cyan                  padding: EdgeInsets.symmetric(vertical: 16, horizontal: 24), // 🔹 More padding
                  minimumSize: Size(double.infinity, 60), // 🔹 Full width, taller
                ),
              ),
              SizedBox(height: 10),
              ElevatedButton.icon(
                onPressed: _isPrinting ? null : () => _issueTicket(100),
                icon: Icon(Icons.local_printshop, size: 28),
                label: Text(
                  'Issue Ticket (LKR 100)',
                  style: TextStyle(fontSize: 18,  color: Colors.white,), // Good contrast on both backgrounds),
                  
                ),
                style: ElevatedButton.styleFrom(
                 backgroundColor: Color(0xFFCDDC39), // Lime
                  padding: EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                  minimumSize: Size(double.infinity, 60),
                ),
              ),

            ],
            SizedBox(height: 20),
            if (_responseMessage != null)
              Text(
                _responseMessage!,
                style: TextStyle(
                  color: _responseMessage!.contains('✅')
                      ? Colors.green
                      : Colors.red,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

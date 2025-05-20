import 'dart:convert';

import 'package:blue_thermal_printer/blue_thermal_printer.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class VehicleTicketingPage extends StatefulWidget {
  @override
  _VehicleTicketingPageState createState() => _VehicleTicketingPageState();
}

class _VehicleTicketingPageState extends State<VehicleTicketingPage> {
  final _vehicleNumberController = TextEditingController();
  String _selectedVehicleType = 'Car';
  bool _isLoading = false;
  bool _isPrinting = false;
  String? _responseMessage;
  double _ticketPrice = 50.0;

  final BlueThermalPrinter bluetooth = BlueThermalPrinter.instance;
  List<BluetoothDevice> _devices = [];
  BluetoothDevice? _selectedDevice;
  bool _testPrinted = false;

  final List<Map<String, dynamic>> _vehicleTypes = [
    {'label': 'Lorry', 'icon': Icons.local_shipping},
    {'label': 'Van', 'icon': Icons.airport_shuttle},
    {'label': 'Three-Wheeler', 'icon': Icons.electric_rickshaw},
    {'label': 'Motorbike', 'icon': Icons.motorcycle},
    {'label': 'Car', 'icon': Icons.directions_car},
  ];

  @override
  void initState() {
    super.initState();
    _loadTicketPrice();
    _initBluetooth();
  }

  Future<void> _loadTicketPrice() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _ticketPrice = prefs.getDouble('ticketPrice') ?? 50.0;
    });
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
        _responseMessage = '❌ PT210 printer not found. Pair it in Bluetooth settings.';
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
      bluetooth.write("====== TEST PRINT ======\n");
      bluetooth.write("Printer connected ✅\n");
      bluetooth.write("========================\n\n\n");
    } catch (e) {
      setState(() {
        _responseMessage = '❌ Test print failed: $e';
      });
    }
  }

  Future<void> issueTicket() async {
    final vehicleNumber = _vehicleNumberController.text.trim();

    if (vehicleNumber.isEmpty) {
      setState(() => _responseMessage = 'Vehicle number is required.');
      return;
    }

    if (_selectedDevice == null) {
      setState(() => _responseMessage = 'Please select a Bluetooth printer.');
      return;
    }

    setState(() {
      _isLoading = true;
      _responseMessage = null;
    });

    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final url = Uri.parse('http://3.108.254.92:5000/api/vehicle-tickets/');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'vehicleNumber': vehicleNumber,
          'vehicleType': _selectedVehicleType,
          'ticketPrice': _ticketPrice,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        await _printTicket(data['ticket']);
        setState(() {
          _responseMessage = '✅ Ticket printed: ID ${data['ticketId']}';
          _vehicleNumberController.clear();
          _selectedVehicleType = 'Car';
        });
      } else {
        setState(() {
          _responseMessage = data['message'] ?? 'Ticket issue failed.';
        });
      }
    } catch (e) {
      setState(() {
        _responseMessage = 'Something went wrong while issuing the ticket.';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _printTicket(Map<String, dynamic> ticket) async {
    setState(() {
      _isPrinting = true;
      _responseMessage = '🖨️ Printing ticket...';
    });

    try {
      bool? connected = await bluetooth.isConnected;
      if (connected != true && _selectedDevice != null) {
        await bluetooth.connect(_selectedDevice!);
        await Future.delayed(Duration(seconds: 1));
      }

      bluetooth.write("\n\n");
      bluetooth.write("====== VEHICLE TICKET ======\n");
      bluetooth.write("Vehicle No : ${ticket['vehicleNumber'] ?? ''}\n");
      bluetooth.write("Type       : ${ticket['vehicleType'] ?? ''}\n");
      bluetooth.write("Price      : Rs. ${ticket['ticketPrice'] ?? ''}\n");
      bluetooth.write("Date       : ${ticket['date'] ?? ''}\n");
      bluetooth.write("Time       : ${ticket['time'] ?? ''}\n");
      bluetooth.write("Issued By  : ${ticket['byWhom'] ?? ''}\n");
      bluetooth.write("============================\n\n\n");

    } catch (e) {
      setState(() {
        _responseMessage = '❌ Printing failed: $e';
      });
    } finally {
      setState(() {
        _isPrinting = false;
      });
    }
  }

  @override
  void dispose() {
    _vehicleNumberController.dispose();
    bluetooth.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Issue Vehicle Ticket')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            TextField(
              controller: _vehicleNumberController,
              decoration: InputDecoration(labelText: 'Vehicle Number'),
              textCapitalization: TextCapitalization.characters,
            ),
            const SizedBox(height: 16),
            Text('Select Vehicle Type', style: TextStyle(fontWeight: FontWeight.bold)),
            Wrap(
              spacing: 10,
              children: _vehicleTypes.map((type) {
                final isSelected = _selectedVehicleType == type['label'];
                return ChoiceChip(
                  label: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(type['icon'], size: 18),
                      const SizedBox(width: 4),
                      Text(type['label']),
                    ],
                  ),
                  selected: isSelected,
                  onSelected: (_) {
                    setState(() {
                      _selectedVehicleType = type['label'];
                    });
                  },
                  selectedColor: Colors.blue.shade100,
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            DropdownButton<BluetoothDevice>(
              value: _selectedDevice,
              hint: Text("Select Printer"),
              items: _devices.map((device) {
                return DropdownMenuItem(
                  value: device,
                  child: Text(device.name ?? device.address ?? 'Unknown Device'),
                );
              }).toList(),
              onChanged: (device) {
                setState(() => _selectedDevice = device);
              },
            ),
            const SizedBox(height: 20),
            _isLoading
                ? Center(child: CircularProgressIndicator())
                : ElevatedButton.icon(
                    onPressed: _isPrinting ? null : issueTicket,
                    icon: Icon(Icons.local_parking),
                    label: Text('Issue Ticket (LKR ${_ticketPrice.toStringAsFixed(2)})'),
                    style: ElevatedButton.styleFrom(padding: EdgeInsets.symmetric(vertical: 16)),
                  ),
            if (_responseMessage != null) ...[
              const SizedBox(height: 20),
              Row(
                children: [
                  if (_isPrinting) CircularProgressIndicator(),
                  if (_isPrinting) const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _responseMessage!,
                      style: TextStyle(
                        color: _responseMessage!.contains('✅')
                            ? Colors.green
                            : (_isPrinting ? Colors.orange : Colors.red),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

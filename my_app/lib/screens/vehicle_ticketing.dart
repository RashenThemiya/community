import 'dart:convert';

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
  String? _responseMessage;
  double _ticketPrice = 50.0;

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
  }

  Future<void> _loadTicketPrice() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _ticketPrice = prefs.getDouble('ticketPrice') ?? 50.0;
    });
  }

  Future<void> issueTicket() async {
    final vehicleNumber = _vehicleNumberController.text.trim();

    if (vehicleNumber.isEmpty) {
      setState(() {
        _responseMessage = 'Vehicle number is required.';
      });
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
        _printTicket(data['ticket']);

        setState(() {
          _responseMessage = '✅ Ticket issued: ID ${data['ticketId']}';
        });

        _vehicleNumberController.clear();
        _selectedVehicleType = 'Car';
      } else {
        setState(() {
          _responseMessage = data['message'] ?? 'Ticket issuing failed.';
        });
      }
    } catch (e) {
      print('Ticket Issue Error: $e');
      setState(() {
        _responseMessage = 'Something went wrong.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _printTicket(Map<String, dynamic> ticket) {
    print('🖨️ Printing Ticket...');
    print('Vehicle: ${ticket['vehicleNumber']}');
    print('Type: ${ticket['vehicleType']}');
    print('Price: ${ticket['ticketPrice']}');
    print('Date: ${ticket['date']} ${ticket['time']}');
    print('Issued by: ${ticket['byWhom']}');
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
            _isLoading
                ? Center(child: CircularProgressIndicator())
                : ElevatedButton.icon(
                    onPressed: issueTicket,
                    icon: Icon(Icons.local_parking),
                    label: Text('Issue Ticket (\$${_ticketPrice.toStringAsFixed(2)})'),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
            if (_responseMessage != null) ...[
              const SizedBox(height: 20),
              Text(
                _responseMessage!,
                style: TextStyle(color: _responseMessage!.contains('✅') ? Colors.green : Colors.red),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

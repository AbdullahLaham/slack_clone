import 'package:flutter/material.dart';

void main() {
  runApp(TheTestApp());
}

class TheTestApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.teal,
          title: RichText(
            text: TextSpan(
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
              ),
              children: [
                TextSpan(
                  text: 'Al-Azhar ',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                TextSpan(
                  text: 'University ',
                  style: TextStyle(
                    fontStyle: FontStyle.italic,
                    fontSize: 14,
                  ),
                ),
                TextSpan(
                  text: 'in Gaza',
                  style: TextStyle(
                    letterSpacing: 4,
                    fontSize: 12,
                    color: Colors.amber,
                  ),
                ),
              ],
            ),
          ),
        ),
        backgroundColor: Colors.teal,
        body: Center(
          child: Table(
            border: TableBorder.all(
              color: Colors.grey,
              width: 1,
            ),
            children: [
              TableRow(
                children: [
                  _buildTableCell('Subject', Colors.amber),
                  _buildTableCell('Subject Hours', Colors.amber),
                ],
              ),
              TableRow(
                children: [
                  _buildTableCell('Math', Colors.grey),
                  _buildTableCell('2', Colors.grey),
                ],
              ),
              TableRow(
                children: [
                  _buildTableCell('Physics', Colors.grey),
                  _buildTableCell('3', Colors.grey),
                ],
              ),
            ],
          ),
        ),
        bottomNavigationBar: BottomAppBar(
          color: Colors.grey,
          shape: CircularNotchedRectangle(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: Icon(Icons.home, color: Colors.white),
                onPressed: () {},
              ),
              IconButton(
                icon: Icon(Icons.settings, color: Colors.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {},
          backgroundColor: Colors.teal,
          child: Icon(Icons.add),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        textDirection: TextDirection.rtl,
      ),
    );
  }

  Widget _buildTableCell(String text, Color color) {
    return Container(
      width: 150,
      padding: EdgeInsets.all(8),
      margin: EdgeInsets.all(4),
      color: color,
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: TextStyle(color: Colors.white),
      ),
    );
  }
}

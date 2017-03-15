type MQTT_Message = record {
	fixed_header1   : uint8;
	fixed_header2   : uint8;
 	#variable_header : bytestring &length = fixed_header2;
 	variable_header : uint8[fixed_header2];
	
} &let {
 	msg_type    : uint8 = (fixed_header1 >> 4);
  	dup_flag    : uint8 = ((fixed_header1 & 0x08) >> 3); 
  	QoS_level   : uint8 = ((fixed_header1 & 0x06) >> 1);
  	retain_flag : uint8 = (fixed_header1 & 0x01);
};

type MQTT_PDU(is_orig: bool) = record {
	fixed_header1   : uint8;
	fixed_header2   : uint8;
 	variable_header : uint8[fixed_header2];
  	#variable_header : bytestring &length = fixed_header2;
} &byteorder=bigendian;


# CONTROL_PACKET :
# +--------+---------------+----------+-----------+--------+
# |  Fixed header, present in all MQTT Control Packets     |
# +--------+---------------+----------+-----------+--------+
# |  Variable header, present in some MQTT Control Packets |
# +--------+---------------+----------+-----------+--------+
# |  Payload, present in some MQTT Control Packets         |
# +--------+---------------+----------+-----------+--------+

# FIXED_HEADER :
# +--------+---------------+----------+-----------+--------+
# |  bit   | 7   6   5   4 |    3     |   2   1   |   0    |
# +--------+---------------+----------+-----------+--------+
# | byte 1 | Message Type  | DUP flag | QoS level | RETAIN |
# +--------+---------------+----------+-----------+--------+
# | byte 2 |              Remaining Length                 |
# +--------+---------------+----------+-----------+--------+

# VARIABLE_HEADER :
# +--------+----+----+-----+-----+-----+-----+------+------+
# |  bit   | 7  | 6  |  5  |  4  |  3  |  2  |  1   |  0   |
# +--------+----+----+-----+-----+-----+-----+------+------+
# | byte 1 |            Packet Identifier MSB              |
# +--------+----+----+-----+-----+-----+-----+------+------+
# | byte 2 |            Packet Identifier LSB              |
# +--------+----+----+-----+-----+-----+-----+------+------+

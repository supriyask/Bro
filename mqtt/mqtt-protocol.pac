##! MQTT control packet parser, contributed by Supriya Sudharani Kumaraswamy

enum MQTT_msg_type {
        MQTT_RESERVED    = 0,
        MQTT_CONNECT     = 1,
        MQTT_CONNACK     = 2,
        MQTT_PUBLISH     = 3,
        MQTT_PUBACK      = 4,
        MQTT_PUBREC      = 5,
        MQTT_PUBREL      = 6,
        MQTT_PUBCOMP     = 7,
        MQTT_SUBSCRIBE   = 8,
        MQTT_SUBACK      = 9,
        MQTT_UNSUBSCRIBE = 10,
        MQTT_UNSUBACK    = 11,
        MQTT_PINGREQ     = 12,
        MQTT_PINGRESP    = 13,
        MQTT_DISCONNECT  = 14,
};

type MQTT_will_obj = record {
	will_topiclen : uint16;
	will_topic: bytestring &length = will_topiclen;
	will_msglen   : uint16; 
	will_msg  : bytestring &length = will_msglen;
};

type MQTT_username_obj = record {
	uname_len   : uint16; 
	uname : bytestring &length = uname_len;
};

type MQTT_password_obj = record {
	pass_len  : uint16; 
	pass : bytestring &length = pass_len;
};

type MQTT_connect = record {
	len              : uint16;
	protocol_name    : bytestring &length = len;
	protocol_version : int8;
	connect_flags    : uint8;
	keep_alive       : uint16;
	clientID_len     : uint16;
	client_id        : bytestring &length = clientID_len;
	will_fields      : case will of {
 			1 -> will_objs: MQTT_will_obj;
			default -> no_will_fileds: empty;
	};
	username_fields  : case username of {
			1 -> uname_objs: MQTT_username_obj;
			default -> no_uname_fields: empty;
	};
	password_fields  : case password of {
			1 -> pass_objs: MQTT_password_obj;
			default -> no_pass_fields: empty;
	};
} &let {
	username      : uint8 = (connect_flags & 0x80) != 0;
	password      : uint8 = (connect_flags & 0x40) != 0;
	clean_session : uint8 = (connect_flags & 0x02) != 0;
	will          : uint8 = (connect_flags & 0x04) != 0;
	will_retain   : uint8 = ((connect_flags & 0x20) != 0) &if(will);
	will_QoS      : uint8 = ((connect_flags & 0x18) >> 3) &if(will);
};

type MQTT_connack = record {
	reserved    : uint8;
	return_code : uint8;
}; 

type MQTT_publish = record {
	topic_len    : uint16;
	topic        :  bytestring &length = topic_len;
	msg_id       : uint16;
	publish_rest : bytestring &restofdata; 
};

type MQTT_puback = record {
	msg_id : uint16;
};

type MQTT_subscribe_topic = record {
	topic_len       : uint16;
	subscribe_topic : bytestring &length = topic_len;
	requested_QoS   : uint8;
};

type MQTT_subscribe = record {
	msg_id : uint16;
	topics : MQTT_subscribe_topic [] &until($element == 0);

};

type MQTT_suback = record {
	msg_id      : uint16;
	granted_QoS : uint8;
};

type MQTT_unsubscribe_topic = record {
	topic_len       : uint16;
	unsubscribe_topic : bytestring &length = topic_len;
};
type MQTT_unsubscribe = record {
	msg_id : uint16;
	topics : MQTT_unsubscribe_topic [] &until($element == 0); 
};

type MQTT_unsuback = record {
	msg_id : uint16;
};

type MQTT_PDU(is_orig: bool) = record {
	fixed_header    : uint8;
	header_length   : uint8;
 	variable_header : case msg_type of {
	    MQTT_CONNECT     -> conn_packet        : MQTT_connect[] &length = header_length;		 
	    MQTT_CONNACK     -> connack_packet     : MQTT_connack[] &length = header_length;		 
	    MQTT_PUBLISH     -> pub_packet         : MQTT_publish[] &length = header_length;		 
	    MQTT_PUBACK      -> puback_packet      : MQTT_puback[] &length = header_length;		 
	    MQTT_PUBREC      -> pubrec_packet      : MQTT_puback[] &length = header_length;		 
	    MQTT_PUBREL      -> pubrel_packet      : MQTT_puback[] &length = header_length;		 
	    MQTT_PUBCOMP     -> pubcomp_packet     : MQTT_puback[] &length = header_length;		 
	    MQTT_SUBSCRIBE   -> subscribe_packet   : MQTT_subscribe[] &length = header_length;		 
	    MQTT_SUBACK      -> suback_packet      : MQTT_suback[] &length = header_length;		 
	    MQTT_UNSUBSCRIBE -> unsubscribe_packet : MQTT_unsubscribe[] &length = header_length;		 
	    MQTT_UNSUBACK    -> unsuback_packet    : MQTT_unsuback[] &length = header_length;
	    default          -> none               : empty;
	};

} &let {
 	msg_type : uint8 = (fixed_header >> 4);
  	dup      : uint8 = ((fixed_header & 0x08) >> 3); 
  	QoS      : uint8 = ((fixed_header & 0x06) >> 1);
  	retain   : uint8 = (fixed_header & 0x01);
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

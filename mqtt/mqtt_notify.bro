##! This script detects mqtt control packet anomalies

@load base/frameworks/notice
@load base/protocols/mqtt

module MQTT;

export {
	redef enum Notice::Type += { 
		## Raised when a connect packet has protocol version
		## other than 3 and 4. 
		Invalid_protocolVersion,

		## Raised when a connect packet has protocol version
		## other than 'MQTT' and 'MQIsdp'. 
		Invalid_protocolId,

		## Raised when a subscribe packet has QoS which is not 1 
		Wrong_subscribe_header,
		};
}

event mqtt_conn(c: connection, msg_type: count, protocol_name: string, protocol_version: count, client_id: string)
{
	if ( protocol_version != 3 && protocol_version != 4)
	{
	        NOTICE([$note=Invalid_protocolVersion,
                	$msg=fmt("%d is not a valid protocol version.", protocol_version),
                	$conn=c]);
        }	
	if ( protocol_name != "MQTT" && protocol_name != "MQIsdp")
	{
	        NOTICE([$note=Invalid_protocolId,
                	$msg=fmt("%d is not a valid protocol version.", protocol_name),
                	$conn=c]);
        }	
}

event mqtt_sub(c: connection, msg_type: count, msg_id: count, subscribe_topic: string, requested_QoS: count)
{
	if (requested_QoS != 1 )
	{
	        NOTICE([$note=Wrong_subscribe_header,
                	$msg=fmt("%d is an invalid QoS to be requested.", requested_QoS),
                	$conn=c]);

        }	
}

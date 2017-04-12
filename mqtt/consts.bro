##! Constants definitions for MQTT

module Mqtt;

export {
    const msg_types = {
	[1] = "connect",
	[2] = "connack",
	[3] = "publish",
	[4] = "puback",	
	[5] = "pubrec",
	[6] = "pubrel",
	[7] = "pubcomp",
	[8] = "subscribe",
	[9] = "suback",
	[10] = "unsubscribe",
	[11] = "unsuback",
	[12] = "pingreq",
	[13] = "pingresp",
	[14] = "disconnect",
    } &default = function(n: count): string { return fmt("unknown-message-type-%d", n); };
}

export {
    const return_codes = {
	[0] = "Connection Accepted",
	[1] = "Refused: unacceptable protocol version",
	[2] = "Refused: identifier rejected",
	[3] = "Refused: server unavailable",
	[4] = "Refused: bad user name or password",	
	[5] = "Refused: not authorized",
    } &default = function(n: count): string { return fmt("unknown-return-code-%d", n); };
}

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



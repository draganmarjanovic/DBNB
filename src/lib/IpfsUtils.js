var IPFS = require('ipfs-api');
const node = new IPFS('localhost', '5001', {protocol: 'http'});

class IpfsUtils {
    
    static publish(object) {
        const buffer = Buffer.from(object);
        node.files.add(buffer).then((response) => {
            let objectId = response[0].hash
            // TODO: Remove the console.log()
            console.log("HASH: " + objectId)
            return objectId 
        }).catch((error) => {
            console.error(error)
        });
    }

}

export default IpfsUtils;
var IPFS = require('ipfs-api')

const node = new IPFS('localhost', '5001', {protocol: 'http'})

function previewFile(){
    var preview = document.querySelector('img'); //selects the query named img
    // var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    let file = event.target.files[0]
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}
     
function fileUploader() {
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.onloadend = () => publish(reader.result)
    reader.readAsArrayBuffer(file)
}

//  saveToIpfs = (reader) => {
//     let ipfsId
//     const buffer = Buffer.from(reader.result)
//     node.files.add(buffer)
//     .then((response) => {
//       console.log(response)
//       ipfsId = response[0].hash
//       console.log("HASH: " + ipfsId)
//       this.setState({added_file_hash: ipfsId})
//     }).catch((err) => {
//       console.error(err)
//     })
//   }

function publish(object) {
    const buffer = Buffer.from(object);
    node.files.add(buffer).then((response) => {
        let objectId = response[0].hash
        console.log("HASH: " + objectId)
        return objectId 
    }).catch((error) => {
        console.error(error)
    });
}  

function store () {
    let toStore = document.getElementById('source').value

    node.files.add(Buffer.from(toStore), (err, res) => {
        if (err || !res) {
        return console.error('ipfs add error', err, res)
        }

        res.forEach((file) => {
        if (file && file.hash) {
            console.log('successfully stored', file.hash)
            display(file.hash)
        }
        })
    })
}

function display (hash) {
    // buffer: true results in the returned result being a buffer rather than a stream
    node.files.cat(hash, (err, data) => {
        if (err) { return console.error('ipfs cat error', err) }

        document.getElementById('hash').innerText = hash
        document.getElementById('content').innerText = data
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('store').onclick = store
    document.getElementById('fileUploader').onchange = fileUploader 
})


var  beep = () => {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

var token;

var getToken =async  ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("scope", "openid profile email resource_api accexible");
    urlencoded.append("client_id", "ClientIdTests");
    urlencoded.append("client_secret", "");

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
    };
    if(token){
        console.log("token is here")
        return token;
    }else{

        return await fetch("https://signin.dev.accexible.es/connect/token", requestOptions)
        .then(response => response.json())
        .then((result) => {
            token = result.access_token
            return token
        })
        .catch(error => console.log('error', error));

    }

}



var sendAudio = async(array) =>{

    let data = 
    {
        "audioModelToLaunch": "python3 /home/CarlaZaldua/Modelos_nueva_arquitectura/prototipo_ivectors/voz.py {{renderaudiofile.path}} {{renderaudiofile.name}}",
        "cutoffPoint": 0.40,
        "description": "Prueba piloto beHIT - SVF Animales",
        "languageCulture": "es-ES",
        "languageId": "76270a24-69b9-46d9-8542-7a05b3024006",
        "languageName": "Español",
        "name": "beHIT",
        "scriptToGeneratePdf": "python3 /home/CarlaZaldua/Modelos_nueva_arquitectura/ML/merge_pdfs.py {{rendertestbattery.pdfdata}}",
        "testBatteryId": "30b5d9cd-41bb-437e-c35a-08da6a220211",
        "testBatteryTestResults": [
            {
                "audioFile": [
                    {
                        "audioBuffer": array
                    }
                ],
                "description": "Cribaje rápido: animales",
                "name": "SVF",
                "testId": "6ca37bf2-8e60-4757-4d6e-08d9ed3b68b9",
                "transcriptionEngine": 0
            }
        ]
    }

    /*let data = {
        "audioModelToLaunch": "python3 /home/CarlaZaldua/Modelos_nueva_arquitectura/prototipo_ivectors/voz.py {{renderaudiofile.path}} {{renderaudiofile.name}}",
        "cutoffPoint": 0.40,
        "description": "Prueba piloto beHIT (English) - SVF Animales",
        "languageCulture": "en-GB",
        "languageId": "087f50f9-8d79-4781-9ba0-840f31db2f77",
        "languageName": "English",
        "name": "beHIT (English)",
        "scriptToGeneratePdf": "python3 /home/CarlaZaldua/Modelos_nueva_arquitectura/ML/merge_pdfs.py {{rendertestbattery.pdfdata}}",
        "testBatteryId": "4ec71748-c347-4c7e-c35b-08da6a220211",
        "testBatteryTestResults": [
            {
                "audioFile": [
                    {
                        "audioBuffer": array
                    }
                ],
                "description": "Cribaje rápido: animales",
                "name": "SVF",
                "testId": "6ca37bf2-8e60-4757-4d6e-08d9ed3b68b9",
                "transcriptionEngine": 0
            }
        ]
    }*/
    
    

    var myHeaders = new Headers();
    myHeaders.append("enctype", "multipart/form-data");
    myHeaders.append("Authorization", "Bearer "+await getToken());
    myHeaders.append("Accept-Encoding", "gzip, deflate, br");
    myHeaders.append("Content-Type", "application/json");

    var formdata = new FormData();
    for ( var key in data ) {
        formdata.append(key, data[key]);
    }


    

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    //mode:"no-cors",
    body: JSON.stringify(data),
    redirect: 'follow'
    };

    await fetch("https://api.dev.accexible.es/api/users/942b4103-ed3d-4b09-178f-08da6a69b0f1/patients/86738903-1d68-4b0e-0805-08da6af81847/patient-test-batteries", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    
}



var getLastTest = async () =>{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+await getToken());

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
    
    return await fetch("https://api.dev.accexible.es/api/users/942b4103-ed3d-4b09-178f-08da6a69b0f1/patients/86738903-1d68-4b0e-0805-08da6af81847/patient-test-batteries", requestOptions)
    .then(response => response.json())
    .then((result) => {
        console.log(result.items)
        return result.items[0].patientTestBatteryId
    })
    .catch(error => console.log('error', error));
} 


var getTestResult = async (testId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+await getToken());

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("https://api.dev.accexible.es/api/users/942b4103-ed3d-4b09-178f-08da6a69b0f1/patients/86738903-1d68-4b0e-0805-08da6af81847/patient-test-batteries/"+testId+"/pdf-file", requestOptions)
    .then(response => response.json())
    .then((e) => {
        const t=new Uint8Array(e);
        let n=new Blob([t],{type:"application/pdf"});
        var i=URL.createObjectURL(n);
        window.open(i);
        setAudioEnabled(true);
        muted = false;
    })
    .catch(error => console.log('error', error));

}


var record =async  ()=>{
    await setTimeout(()=>{

        console.log("Starting neurology test");
        beep()
        let audioIN = { audio: true };
        //  audio is true, for recording

        navigator.mediaDevices.getUserMedia(audioIN)

        .then(async function (stream) {

            var recorder =new  StereoAudioRecorder(stream,{
                numberOfAudioChannels: 1,
            })

            await recorder.record()

            setTimeout(async ()=>{
                recorder.stop(async(blob) => {
                    blob.arrayBuffer()
                    .then(async (buffer)=>{
			beep()
                        let msg = "Thank you ... we will prepare your results in seconds"
                        //let utterThis = new SpeechSynthesisUtterance(msg)
                        $("#chat-wrapper").prepend(
                            $(".chat-left")
                            .last()
                            .clone()
                            .val(msg)
                          ) 
                        //synth.speak(utterThis)
                        var myBuffer = new Uint8Array(buffer)
                        var array = Array.from(myBuffer)
                        await sendAudio(array);
                        console.log("audio sent")
                        var last_test

                        setTimeout(async()=>{
                            console.log("getting results")
                            last_test = await getLastTest();
                            getTestResult(last_test);
                        },1000*30)
                    })

                });

            },60*1000)
            
        })

        .catch(function (err) {
            console.log(err.name, err.message);
        });

    },1000)
}

var startNeurologyTest =async ()=>{
    await record();
}

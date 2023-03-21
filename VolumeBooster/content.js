let gain_node;

const createGainNodeFromAudioContext = (mediaStream) => {
    const audioContext = new AudioContext();
    const mediaElementAudioSourceNode = audioContext.createMediaElementSource(mediaStream);
    const node = audioContext.createGain();

    node.gain.value = 1;
    mediaElementAudioSourceNode.connect(node);
    node.connect(audioContext.destination);

    return node;
}

const setup = () => {
    const mediaStream = document.querySelector("video");

    if (!mediaStream) {
        return null;
    }

    const node = createGainNodeFromAudioContext(mediaStream);

    return node;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.id == 1) {
        console.log(request.message);
        gain_node = gain_node || setup();

        if(gain_node == null){
            console.log("No MediaStream");
            sendResponse("No MediaStream");
            return;
        }

        gain_node.gain.value = Number(request.message);
        sendResponse("ok");
    }
});

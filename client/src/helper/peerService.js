class PeerProvider {
   constructor() {
    if (!this.peer) {
      fetch("https://chat-hub.metered.live/api/v1/turn/credentials?apiKey=3f9ef4bcde68fb2bb9eed042698a5b1f9f8f").then((res)=>{
        return res.json();
      }).then((data)=>{
        this.peer = new RTCPeerConnection({
          iceServers: data 
        });
      }).catch((err)=>{
        console.log(err);
      })
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setRemoteDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default new PeerProvider();

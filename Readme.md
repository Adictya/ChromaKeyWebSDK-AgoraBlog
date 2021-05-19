# Chroma Key using HTML5 Canvas and Agora WebSdk

Guide project to setup chroma key ie background removal/replacement
Demo at - https://www.adictya.dev/ChromaKeyWebSDK-AgoraBlog/

## Prerequisites

- Live server or equivalent http server utility
- Agora [Developer Account](https://console.agora.io/)

## Create an Account and Obtain an App ID

To run the sample website, first obtain an app ID:

1. Create a developer account at agora.io. Once you finish the sign-up process, you are redirected to the dashboard.
2. Navigate in the dashboard tree on the left to Projects > Project List.
3. Copy the appID
4. Paste it [here](https://github.com/Adictya/PresentationModeWebSdk-AgoraBlog/blob/ba83e3197f8b9515bc137877d189a295d73f8d73/agora-rtc.js#L33) (./agora-rtc.js#133)

## Usage

```bash
git clone https://github.com/Adictya/PresentationModeWebSdk-AgoraBlog.git
cd ChromaKeyWebSDK-AgoraBlog
npm i live-server -g
live-server .
```

## Resources

- You can find the complete API Documentation over [here](https://docs.agora.io/en/Video/API%20Reference/flutter/index.html).
- You can refer this [blog](https://meherdeept.medium.com/group-video-calling-using-agoras-flutter-sdk-53abbef1bb55) where I walk through the process of setting up canvases and how to multiplex video streams step by step.
- I also invite you to join [Agora.io Developer Slack Community](https://agoraio.slack.com/).

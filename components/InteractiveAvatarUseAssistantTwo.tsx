import {
  Configuration,
  NewSessionData,
  StreamingAvatarApi,
} from "@heygen/streaming-avatar";
import { Button, Spinner, Tooltip } from "@nextui-org/react";
import { Keyboard, Microphone, StopCircle } from "@phosphor-icons/react";
import { useAssistant } from "ai/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";
import MessageList from "./MessageList";
import MicrophoneInput, { MicrophoneStatus } from "./MicrophoneInput";
import { PauseCircle } from "@phosphor-icons/react/dist/ssr";

const avatarId = "60439e8c0fe7428bb9b6c41772258a6b"; //'Angela-insuit-20220820';
//const avatarId = "52f3786c8c9543248a5cfcddad53813a"
const voiceId = "dbb805f1b63a40ec869c66819ade215e";

export default function InteractiveAvatar() {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [data, setData] = useState<NewSessionData>();
  const [initialized, setInitialized] = useState(false); // Track initialization
  const [recording, setRecording] = useState(false); // Track recording state
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatarApi | null>(null);
  const [isText, swithText] = useState(true);
  const [isListening, setListening] = useState(false);
  const [talking, setTalking] = useState(false);
  const [tips, setTips] = useState('')
  const [showReplay, setShowReplay] = useState(false);

  const { input, status, setInput, submitMessage, messages } = useAssistant({
    api: "/api/assistant",
  });
  const [touched, setTouched] = useState(false);
  const firstflag = useRef(true); //移除首次加载两次
  const [microInputChangeFlags, SetMicroInputChangeFlags] = useState(false);

  useEffect(() => {
    //触发播放
    if (status != "awaiting_message" || messages.length == 0) return;
    console.log("ChatGPT Response:", messages);
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }

    const text = messages[messages.length - 1].content.replaceAll("**", "");

    //send the ChatGPT response to the Interactive Avatar
    handleSpeak(text);
    setIsLoadingChat(false);
  }, [status]);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      // const token = 'eyJ0b2tlbiI6ICJhYmIyZjhlOWI2Nzg0MmI2ODgwYTUxNDRmZGEzNmVjYSIsICJ0b2tlbl90eXBlIjogInNhX2Zyb21fdHJpYWwiLCAiY3JlYXRlZF9hdCI6IDE3MjY3NTgyOTF9'
      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);

      return "";
    }
  }

  async function startSession() {
    setIsLoadingSession(true);
    await updateToken();
    if (!avatar.current) {
      setDebug("Avatar API is not initialized");

      return;
    }
    try {
      const res = await avatar.current.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: avatarId,
            voice: { voiceId: voiceId },
          },
        },
        setDebug,
      );

      setData(res);
      setStream(avatar.current.mediaStream);
      setShowReplay(false);
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setDebug(
        `There was an error starting the session. ${voiceId ? "This custom voice ID may not be supported." : ""}`,
      );
    }
    setIsLoadingSession(false);
  }


  useEffect(() => {
    console.log(debug)
    if (debug && debug?.indexOf('disconnected') > -1) {
      setShowReplay(true)
    }
  }, [debug])

  async function updateToken() {
    const newToken = await fetchAccessToken();

    console.log("Updating Access Token:", newToken); // Log token for debugging
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken, jitterBuffer: 200 }),
    );

    const startTalkCallback = (e: any) => {
      setTalking(true);
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e: any) => {
      setTalking(false);
      console.log("Avatar stopped talking", e);
    };

    console.log("Adding event handlers:", avatar.current);
    avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
    avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);

    setInitialized(true);
  }

  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      .interrupt({ interruptRequest: { sessionId: data?.sessionId } })
      .catch((e) => {
        setDebug(e.message);
      });
  }

  async function endSession() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current.stopAvatar(
      { stopSessionRequest: { sessionId: data?.sessionId } },
      setDebug,
    );
    setStream(undefined);
    console.info("end session");
  }

  async function handleSpeak(text: string) {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      .speak({ taskRequest: { text: text, sessionId: data?.sessionId } })
      .catch((e) => {
        console.log('error:' + e.message);
        setDebug(e.message);
      })
  }

  useEffect(() => {
    if (touched && initialized) {
      handleSpeak("你好，有什麼可以幫你");
    }
  }, [touched, initialized]);

  useEffect(() => {
    if (!firstflag.current) {
      return;
    }
    async function init() {
      // const newToken = await fetchAccessToken();
      // console.log("Initializing with Access Token:", newToken); // Log token for debugging
      // avatar.current = new StreamingAvatarApi(
      //   new Configuration({ accessToken: newToken, jitterBuffer: 200 })
      // );
      // setInitialized(true); // Set initialized to true
      // //auto startSession
      // //TODO auto start
      await startSession();

      const firstTouchAction = () => {
        if (!touched) {
          setTouched(true);
          document.body.removeEventListener("click", firstTouchAction);
        }
      };

      document.body.addEventListener("click", firstTouchAction);
    }
    init();
    firstflag.current = false;

    // startSession();
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  const stopPlayVideo = () => {
    if (stream && mediaStream.current) {
      mediaStream.current!.pause();
    }
  };

  function handlerSendMessage() {
    setIsLoadingChat(true);
    console.log("send to serverr ", input);
    if (!input) {
      setDebug("Please enter text to send to ChatGPT");

      return;
    }
    // handleSubmit();
    submitMessage();
    setListening(false);
  }

  useEffect(() => {
    if (microInputChangeFlags && input) {
      handlerSendMessage();
      SetMicroInputChangeFlags(false);
    }
  }, [microInputChangeFlags, input]);


  useEffect(() => {
    if (status == 'in_progress') {
      setTips('我正在思考，請稍後')
    } else {
      if (isText) {
        setTips('');
        return;
      }

      if (talking) {
        setTips(input)
        return;
      }
      if (isListening) {
        setTips(input || '我正在聽')
      } else {
        setTips('點擊麥克風，開始聊天');
      }
    }
  }, [status, isText, talking, isListening, input]);

  function micSubmit(content: string) {
    setInput(content);
    SetMicroInputChangeFlags(true);
  }

  function parse() {
    if (avatar.current) {
      if (mediaStream.current?.played) {
        mediaStream.current.pause();
      } else {
        mediaStream.current?.play();
      }
    }
  }


  return (
    <div className="page w-screen h-[calc(100dvh)] flex flex-col justify-center items-center overflow-hidden">
      {stream && (
        <div className="w-screen  h-[calc(100dvh)] justify-center  items-center flex flex-row rounded-lg overflow-hidden z-30 relative">
          <video
            ref={mediaStream}
            autoPlay
            playsInline
            muted={!touched}
            // style={{
            //   width: "100%",
            //   height: "100%",
            //   objectFit: "contain",
            // }}
            className="max-w-none h-full max-h-[80%] ml-[-40px] tablet:w-full tablet:max-h-full tablet:ml-0 laptop:max-h-full laptop:h-full  desktop:w-full desktop:h-auto"
          >
            <track kind="captions" />
          </video>


        </div>
      )}
      {isLoadingSession && (
        <div className="h-full justify-center absolute top-0 left-0 items-center flex flex-col gap-8 w-full self-center z-50">
          <Spinner color="default" size="lg" />
          <span>初始化中....</span>
        </div>
      )}

      {!touched && !isLoadingSession ? (
        <div className="h-full justify-center absolute top-0 left-0 items-center flex flex-col gap-8 w-full self-center ">
          <span className="z-50 cursor-pointer" >請點擊開始對話</span>
        </div>
      ) : null}

      {tips && (
        <div className="h-full justify-center absolute top-0 left-0 items-center flex flex-col gap-8 w-full self-center ">
          <span className="text-warp backdrop-blur-sm bg-white/10  rounded-md p-1 z-50">
            {tips}
          </span>
        </div>
      )}

      {showReplay && (
        <div className="h-full justify-center absolute top-0 left-0 items-center flex flex-col gap-8 w-full self-center ">
          <div className="text-warp backdrop-blur-sm bg-white/10  rounded-md p-1 z-50 h-120 w-120  rounded-md flex flex-col items-center p-4">
            <Button color="danger" size="md" onClick={startSession}>Replay</Button>
            <span className="text-color">會話已失效，點擊重新啟動工作階段</span>
          </div>
        </div>
      )}

      {/* {talking && (
        <div className="h-full justify-center absolute top-0 left-0 items-end flex flex-col gap-8 w-full self-center ">
          <div className="text-warp backdrop-blur-sm bg-black/10  rounded-md p-1 z-50 h-120 w-120 mr-4  rounded-md flex flex-col p-1">
            <PauseCircle size={50} className="text-black-400" onClick={handleInterrupt} />
          </div>
        </div>
      )} */}
      {/*
      <p className="font-mono text-right absolute top-1 right-1 z-40">
         <span className="font-bold">Console:</span>
        <br /> 
        {debug}
      </p>*/}
      <div className="flex flex-col w-full absolute bottom-2 gap-1 px-2 z-40">
        <div className="w-full overflow-hidden z-20 max-h-[200px] rounded py-1 mb-12">
          <MessageList messages={messages} />
        </div>

        <div className="w-full flex flex-row relative items-center gap-2" style={{ zIndex: 99 }}>
          {isText ? (
            <InteractiveAvatarTextInput
              disabled={!stream}
              input={input}
              label="Chat"
              talking={talking}
              loading={isLoadingChat}
              placeholder="請輸入你的問題"
              setInput={setInput}
              onStop={() => { handleInterrupt() }}
              onSubmit={() => {
                handlerSendMessage();
              }}
            />
          ) : (
            talking ?
              <div className="w-full flex flex-row justify-center relative">
                <Button
                  // size="lg"
                  radius="full"
                  className="bg-danger-500 ml-10 h-16 w-16 absolute bottom-0"
                  isIconOnly>
                  <StopCircle fontSize={80} onClick={() => handleInterrupt()} />
                </Button>
              </div> :
              <MicrophoneInput
                contentChange={(content) => {
                  setInput(content);
                }}
                talking={talking}
                onSubmit={micSubmit}
                onStatusChange={(status => {
                  setListening(status == MicrophoneStatus.Listening)
                })}
              />
          )}

          <Tooltip content={!isText ? "切換鍵盤" : "切換錄音"}>
            <Button
              isIconOnly
              className={clsx(
                "mr text-white w-1",
                !recording
                  ? "bg-gradient-to-tr from-indigo-500 to-indigo-300"
                  : "",
              )}
              size="md"
              variant="shadow"
              onClick={() => swithText(!isText)}
            >
              {!isText ? <Keyboard size={30} /> : <Microphone size={30} />}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div >
  );
}

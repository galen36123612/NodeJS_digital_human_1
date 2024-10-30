"use client";

import InteractiveAvatar from "@/components/InteractiveAvatarUseAssistant";
import ChatMessageDemo from "@/components/ChatMessageDemo";
import InteractiveAvatarUseAssistantTwo from "@/components/InteractiveAvatarUseAssistantTwo";

export default function App() {
  const tabs = [
    {
      id: "Two",
      label: "Two",
      content: <InteractiveAvatarUseAssistantTwo />,
    },
    {
      id: "test",
      label: "test",
      content: <ChatMessageDemo />,
    },
    {
      id: "demo",
      label: "Demo",
      content: <InteractiveAvatar />,
    },
    // {
    //   id: "code",
    //   label: "Code",
    //   content: <InteractiveAvatarCode />,
    // },
  ];

  return (
    <div className="w-screen h-[calc(100dvh)] flex flex-col">
      <div className="w-screen h-[calc(100dvh)] flex flex-col items-start justify-start gap-5">
        {/* <div className="w-full">
          <Tabs items={tabs}>
            {(items) => (
              <Tab key={items.id} title={items.label}>
                {items.content}
              </Tab>
            )}
          </Tabs>
        </div> */}
        <InteractiveAvatarUseAssistantTwo />
        {/* <MicrophoneInput /> */}
      </div>
    </div>
  );
}

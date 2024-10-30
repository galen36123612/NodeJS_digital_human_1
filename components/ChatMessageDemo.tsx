import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { useAssistant } from "ai/react";

export default function ChatMessageDemo() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: "/api/assistant" });

  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image
        alt="Woman listing to music"
        className="object-cover"
        height={200}
        src="https://nextui.org/images/hero-card.jpeg"
        width={200}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">Available soon.</p>
        <Button
          className="text-tiny text-white bg-black/20"
          color="default"
          radius="lg"
          size="sm"
          variant="flat"
        >
          Notify me
        </Button>
      </CardFooter>
    </Card>
    // <div className="flex flex-col gap-2">
    //   <div className="p-2">status: {status}</div>

    //   <div className="flex flex-col p-2 gap-2">
    //     {messages.map((message: Message) => (
    //       <div key={message.id} className="flex flex-row gap-2">
    //         <div className="w-24 text-zinc-500">{`${message.role}: `}</div>
    //         <div className="w-full">{message.content.replaceAll("**","")}</div>
    //       </div>
    //     ))}
    //   </div>

    //   <form onSubmit={submitMessage} className="fixed bottom-0 p-2 w-full">
    //     <input
    //       className="bg-zinc-100 w-full p-2 text-black"
    //       placeholder="Send message..."
    //       value={input}
    //       onChange={handleInputChange}
    //       disabled={status !== 'awaiting_message'}
    //     />
    //   </form>
    // </div>
  );
}

import { Input, Spinner, Tooltip } from "@nextui-org/react";
import { PaperPlaneRight, StopCircle } from "@phosphor-icons/react";
import clsx from "clsx";

interface StreamingAvatarTextInputProps {
  label: string;
  placeholder: string;
  input: string;
  onSubmit: () => void;
  setInput: (value: string) => void;
  onStop?: () => void;
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  talking?: boolean;
}

export default function InteractiveAvatarTextInput({
  label,
  placeholder,
  input,
  onSubmit,
  setInput,
  onStop = () => { },
  endContent,
  disabled = false,
  loading = false,
  talking = false
}: StreamingAvatarTextInputProps) {
  function handleSubmit() {
    if (input.trim() === "") {
      return;
    }
    onSubmit();
    setInput("");
  }

  return (
    <div className="w-full">
      <Input
        endContent={
          <div className="flex flex-row items-center h-full">
            {endContent}
            <Tooltip content="Send message">
              {loading ? (
                <Spinner
                  className="text-indigo-300 hover:text-indigo-200"
                  color="default"
                  size="sm"
                />
              ) : (!talking ?
                <button
                  className="focus:outline-none"
                  type="submit"
                  onClick={handleSubmit}
                >
                  <PaperPlaneRight
                    className={clsx(
                      "text-indigo-300 hover:text-indigo-200",
                      disabled && "opacity-50",
                    )}
                    size={24}
                  /></button>
                :
                <button
                  className="focus:outline-none"
                  type="submit"
                  onClick={onStop}
                >
                  <StopCircle
                    className={clsx(
                      "text-danger-400",
                      disabled && "opacity-50",
                    )}
                    size={40}
                  />
                </button>
              )}
            </Tooltip>
          </div>
        }
        label={label}
        placeholder={placeholder}
        size="sm"
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        onValueChange={setInput}
      // isDisabled={disabled}
      />
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { VscSymbolKeyword } from "react-icons/vsc";
import { FaChessKing } from "react-icons/fa";
// import { fetchNewParagraph } from "../Services/Api";

const Paragraph: string =
  "debbie knew she was being selfish and unreasonable. She understood why the others in the room were angry and frustrated with her and the way she was acting.";

const LaunchPad: React.FC = () => {
  let MaxTime: number = 60;
  const [timeLeft, setTimeLeft] = useState<number>(MaxTime);
  const [mistakes, setMistakes] = useState<number>(0);
  const [WPM, setWPM] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  // const [CPM, setCPM] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // const [Paragraph, setParagraph] = useState<string>(defaultParagraph);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [correctWrong, setCorrectWrong] = useState<string[]>([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setCorrectWrong(Array(Paragraph.length).fill(""));
    }
  }, []);

  useEffect(() => {
    const initializeTest = async () => {
      // const newParagraph = await fetchNewParagraph();
      // setParagraph(newParagraph);
      // setCorrectWrong(Array(newParagraph.length).fill(""));
    };
    
    initializeTest();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        let correctChars = charIndex - mistakes;
        let totalTime = MaxTime - timeLeft;

        // let cpm = correctChars * (60 / totalTime);
        // cpm = cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
        // setCPM(parseInt(cpm.toFixed(0), 10));

        let wpm = Math.round((correctChars / 5 / totalTime) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        setWPM(wpm);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
      showPopup();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTyping, timeLeft]);

  const restartTest = () => {
    setTimeLeft(MaxTime);
    setMistakes(0);
    setWPM(0);
    // setCPM(0);
    setIsTyping(false);
    setCharIndex(0);
    setCorrectWrong(Array(Paragraph.length).fill(""));
    setShowModal(false);

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const characters = charRefs.current;
    let currentChar = characters[charIndex];
    console.log(currentChar?.textContent);
    
    let typedChar = e.target.value.slice(-1);
  
    if (charIndex < characters.length && timeLeft > 0) {
      if (!isTyping) {
        setIsTyping(true);
      }
  
      if (typedChar === currentChar?.textContent) {
        setCharIndex((prevIndex) => prevIndex + 1);
        setCorrectWrong((prev) => {
          const newArr = [...prev];
          newArr[charIndex] = "correct";
          return newArr;
        });
      } else {
        setCharIndex((prevIndex) => prevIndex + 1);
        setMistakes((prev) => prev + 1);
        setCorrectWrong((prev) => {
          const newArr = [...prev];
          newArr[charIndex] = "wrong";
          return newArr;
        });
      }

      console.log(charIndex);
      console.log(characters.length - 1);
      
  
      if (charIndex === characters.length - 1) {
        setIsTyping(false);
        showPopup();
      }
    } else {
      setIsTyping(false);
    }
  };
  

  const showPopup = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const correctChars = Paragraph.length - mistakes;
  const accuracy = ((correctChars / Paragraph.length) * 100).toFixed(2);

  return (
    <>
      <div className="first-section w-full h-[40vh] bg-[#101c32] flex justify-center items-center flex-col">
        <div className="bg-indigo-900 p-2 rounded-lg flex justify-center items-center gap-3">
          <div className="bg-black px-2 py-1 rounded-lg flex justify-center items-center gap-1">
            <div>
              <VscSymbolKeyword className="text-white" />
            </div>
            <div>
              <h1 className="text-white">Words</h1>
            </div>
          </div>
          <div className="bg-black px-2 py-1 rounded-lg flex justify-center items-center gap-1">
            <div>
              <FaChessKing className="text-white" />
            </div>
            <div>
              <h1 className="text-white">Mixed Words</h1>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-2/3 mt-10">
          <div>
            <h1 className="text-white text-1xl underline">
              Time Left: <strong>{timeLeft}</strong>
            </h1>
          </div>
          <div>
            <h1 className="text-white text-1xl underline">No. of words: 60</h1>
          </div>
        </div>
      </div>
      <div className="first-section w-full h-[60vh] bg-gray-900">
        <div className="flex justify-center items-center h-full">
          <div className="w-4/5 text-center flex justify-center flex-wrap">
            <input
              type="text"
              className="opacity-0 z-0 absolute"
              ref={inputRef}
              onChange={handleChange}
            />
            {Paragraph.split("").map((char, index) => (
              <span
                className={`text-2xl text-gray-500 ${
                  index === charIndex ? "text-green-400 border-r-4" : ""
                } bg-sky-900 rounded-md p-2 mx-[1px] mt-[2px] border ${
                  correctWrong[index] === "correct"
                    ? "!bg-green-600 text-white"
                    : correctWrong[index] === "wrong"
                    ? "!bg-red-600 text-white"
                    : ""
                }`}
                key={index}
                ref={(e) => {
                  charRefs.current[index] = e;
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-sky-950 shadow-lg p-6 w-4/5 sm:w-1/3 border-blue-800 border-2 rounded-xl border-animation">
            <h2 className="text-white text-xl font-bold mb-4 text-center">
              Typing Test Complete!
            </h2>
            <div className="text-white flex justify-around">
              <p className="mb-2">WPM: {WPM}</p>
              <p className="mb-2">Accuracy: {accuracy}%</p>
            </div>
            <div className="text-white flex justify-around">
              <p className="mb-2">Correct Letters: {correctChars}</p>
              <p className="mb-2">Wrong Letters: {mistakes}</p>
            </div>
            <div className="text-center">
              <button
                className="mt-4 px-4 py-2 text-white rounded transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                onClick={restartTest}
              >
                Restart
              </button>
              <button
                className="mt-4 px-4 py-2 text-white rounded transition ease-in-out delay-150 bg-red-500 hover:-translate-y-1 hover:scale-110 hover:bg-red-600 duration-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LaunchPad;
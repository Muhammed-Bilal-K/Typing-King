import axios from "axios";

export const fetchNewParagraph = async () => {
  try {
    const response = await axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text');
    const fullParagraph = response.data;

    const words = fullParagraph.split(' ');
    const limitedParagraph = words.slice(0, 20).join(' ');

    return limitedParagraph;
  } catch (error) {
    console.error('Error fetching new paragraph:', error);
    return "Default text for error handling.";
  }
};


// debbie knew she was being selfish and unreasonable. She understood why the others in the room were angry and frustrated with her and the way she was acting."
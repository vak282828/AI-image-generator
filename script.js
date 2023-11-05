const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
        }
    });
};

const generateAiImage = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });
        
        if (!response.ok) throw new Error("Failed to generate images! Please try again");

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    }
};

const handleFormSubmission = (e) => {
    e.preventDefault();
    
    const userPrompt = e.target[0].value;
    const userImgQuantity = e.target[1].value;

    const imgCardMarkup = Array.from({ length: userImgQuantity }, () => 
         `<div class="img-card loading">
             <img src="images/loader.svg" alt="image">
             <a href="#" class="download-btn">
                 <img src="images/download.svg" alt="download icon">
             </a>
         </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImage(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);

const useCreateFormData = () => {
    const creatingFormData = async (images: string | any[], postID: number) => {
        const formDataArray: FormData[] = [];
        const imageArray = Array.isArray(images) ? images : [images];

        for (const image of imageArray) {
            try {
                if (image) {
                    const response = await fetch(image);
                    const fileName = image.split("/").pop();
                    const formData = new FormData();
                    const type = image.split(".").pop();

                    formData.append("file", { uri: image, name: fileName, type: `image/${type}` } as any);
                    formData.append("post_id", postID.toString());

                    formDataArray.push(formData);
                }
            } catch (error) {
                console.log("Error processing image:", error);
            }
        }

        return formDataArray;
    };

    return { creatingFormData }; // ✅ Return the function
};

export default useCreateFormData;

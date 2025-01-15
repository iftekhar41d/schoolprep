import Quill from "quill";

class CustomImageHandler {
  constructor(editor) {
    this.quill = editor;
  }

  uploadImage() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result;
        const resizedImage = await this.resizeImage(base64Image, 800, 800); // Resize to 800x800 max
        this.insertToEditor(resizedImage);
      };
      reader.readAsDataURL(file);
    };
  }

  async resizeImage(base64Image, maxWidth, maxHeight) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.floor((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.floor((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8)); // Adjust quality as needed
      };
    });
  }

  insertToEditor(url) {
    const range = this.quill.getSelection();
    this.quill.insertEmbed(range.index, "image", url);
    this.quill.setSelection(range.index + 1); // Move cursor forward
  }
}

export default CustomImageHandler;

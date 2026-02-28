import os
import cv2
from Model.model import FRModel
from Database.FRDb import FRDb, Info
from Utils.utils import detect_face, crop_face, add_face 
from Model.model import ModelFactory
from Config.config import Retina_ArcConfig, JSONDbConfig
from Database.FRDb import DbFactory


def choose_faces_and_input_info(cropped_faces):
    face_list = []

    for i, (face_img, face) in enumerate(cropped_faces):
        print(f"\nFace {i}")
        cv2.imshow(f"Face {i}", face_img)
        cv2.waitKey(1)

        name = input("Enter name (or 'skip'): ").strip()
        if name.lower() == "skip":
            cv2.destroyWindow(f"Face {i}")
            continue

        location = input("Enter location (optional): ").strip()

        info = Info(
            name=name if name else None,
            location=location if location else None,
        )

        face_list.append((face_img, face, info))

        cv2.destroyWindow(f"Face {i}")

    cv2.destroyAllWindows()
    return face_list


def main():
    dbConfig = JSONDbConfig(
        "frdb.json",
        "images"
    )

    db = DbFactory.create("jsonDb", dbConfig)


    img_path = input("Enter image path: ").strip()

    if not os.path.exists(img_path):
        print("Image not found.")
        return

    img = cv2.imread(img_path)
    if img is None:
        print("Cannot read image.")
        return

    # ⚠ model phải được khởi tạo trước
    modelConfig = Retina_ArcConfig(
        device="cpu",
        det_size=640,
        scale="s"
    )

    model = ModelFactory.create("retina_arc", modelConfig)

    faces = detect_face(model, img)

    if len(faces) == 0:
        print("No faces detected.")
        return

    cropped_faces = crop_face(img, faces)

    if len(cropped_faces) == 0:
        print("No valid faces.")
        return

    face_list = choose_faces_and_input_info(cropped_faces)

    if len(face_list) == 0:
        print("No face selected.")
        return

    ids = add_face(db, face_list)

    print("Saved IDs:", ids)


if __name__ == "__main__":
    main()
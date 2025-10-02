from flaskr import create_app
from flaskr.models.tag_model import TagModel
from flaskr.db import db


def seed_tags():
    tag_names = [
        "Work",
        "Study",
        "Free Time",
        "Exercise",
        "Health",
        "Travel",
        "Hobbies",
        "Shopping",
        "Finances",
        "Family",
        "Chores",
        "Friends",
        "Meetings",
        "Goals",
        "Projects",
        "Learning",
        "Entertainment",
        "Relaxation",
        "Urgent",
        "Miscellaneous",
    ]

    app = create_app()

    with app.app_context():
        try:
            # Vérifier si des tags existent déjà
            existing_count = TagModel.query.count()
            if existing_count > 0:
                print(f"Tags already exist ({existing_count}). Skipping seed.")
                return

            for tag_name in tag_names:
                new_tag = TagModel(name=tag_name)
                db.session.add(new_tag)

            # Commit UNE SEULE FOIS après la boucle
            db.session.commit()
            print(f"Successfully inserted {len(tag_names)} tags")

        except Exception as err:
            db.session.rollback()
            print(f"Error while seeding: {err}")


if __name__ == "__main__":
    seed_tags()

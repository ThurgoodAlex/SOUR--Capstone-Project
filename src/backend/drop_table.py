from sqlmodel import SQLModel, create_engine
from PRISM.src.prism_services.schema import ListingInDB  # Make sure to import your model

# Set up the database engine
DATABASE_URL = "sqlite:///test_prism.db"  # Replace with your actual database URL
engine = create_engine(DATABASE_URL)

def drop_table():
    # Drop the table if it exists
    SQLModel.metadata.tables[ListingInDB.__tablename__].drop(engine, checkfirst=True)
    print(f"Table {ListingInDB.__tablename__} has been dropped.")

if __name__ == "__main__":
    drop_table()
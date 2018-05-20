# Folder Fiddler

**Navigate to folder to sort with special LJI algorithm.**

This is a minimal prototype Electron application to traverse the users OS drives. & sort selected directories with special sorting algorithm.

**The sorting algorithm**

We look for filenames that start with atleast 5 digits. 
We then take the unique numbers found and create folders based on the file name.

Subfolders in the new created folders are made & the matching files (files with the same numbers sequence in the begining of the file name)
and move them to the correct folder/subfolders based on the file type and names.

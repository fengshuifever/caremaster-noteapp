import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./src/components/Header";
import NoteListItem from "./src/components/NoteListItem";
import NoteForm from "./src/components/NoteForm";

import clientsJson from "./src/data/clients.json";
import categoriesJson from "./src/data/categories.json";
import { Note, Client, Category } from "./src/models/models";

const App: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null); // Add this line
  const [isNoteFormVisible, setIsNoteFormVisible] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Load clients, categories, and notes from storage when the component mounts
    loadClients();
    loadCategories();
    loadNotes();
  }, []);

  const loadClients = async () => {
    setClients(clientsJson);
  };

  const loadCategories = async () => {
    setCategories(categoriesJson);
  };

  const loadNotes = async () => {
    const notesJson = await AsyncStorage.getItem("@notes");
    const notesData: Note[] = notesJson ? JSON.parse(notesJson) : [];
    setNotes(notesData);
  };

  const addNote = (newNote: Note) => {
    const updatedNote = { ...newNote, id: notes.length + 1 };
    setNotes([...notes, updatedNote]);
  };

  const openNoteForm = () => {
    setIsNoteFormVisible(true);
  };

  const closeNoteForm = () => {
    setIsNoteFormVisible(false);
    loadNotes();
  };

  const handleDeleteNote = async (noteToDelete: Note) => {
    try {
      // Filter out the note to be deleted
      const updatedNotes = notes.filter((note) => note.id !== noteToDelete.id);

      // Save the updated notes back to AsyncStorage
      await AsyncStorage.setItem("@notes", JSON.stringify(updatedNotes));

      // Update state to reflect the deletion
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Failed to delete the note.");
    }
  };

  const editNote = (selectedNote: Note) => {
    // Set the selected note for editing
    setSelectedNote(selectedNote);
    // Open the modal for editing
    openNoteForm();
  };

  const saveChangesToNote = (updatedNote: Note) => {
    // Find the index of the note to update
    const noteIndex = notes.findIndex((note) => note.id === updatedNote.id);

    // If the note is found, update it in the state
    if (noteIndex !== -1) {
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = updatedNote;
      setNotes(updatedNotes);
    }

    // Optionally, you can clear the selectedNote state after saving changes
    setSelectedNote(null);
  };

  const renderNoteItem = ({ item }: { item: Note }) => {
    // Find the client and category based on their IDs
    const client = clients.find((client) => client.id === item.clientId);
    const category = categories.find(
      (category) => category.id === item.categoryId
    );

    return (
      <NoteListItem
        note={item}
        clientName={client ? client.name : "Unknown Client"}
        categoryName={category ? category.name : "Unknown Category"}
        onEdit={editNote}
        onDelete={handleDeleteNote}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header></Header>

      {/* NoteForm modal */}
      <NoteForm
        clients={clients}
        categories={categories}
        isVisible={isNoteFormVisible}
        onClose={closeNoteForm}
        onSubmit={selectedNote ? saveChangesToNote : addNote}
        saveButtonText={selectedNote ? "Save Changes to Note" : "Create Note"}
        initialNote={selectedNote}
      />

      <View style={styles.buttonContainer}>
        <Pressable style={styles.addButton} onPress={openNoteForm}>
          <Text style={styles.addButtonText}>Add Note</Text>
          <Icon name="plus" size={30} color="white"></Icon>
        </Pressable>
      </View>
      {notes.length === 0 ? (
        <View style={styles.noNotesContainer}>
          <Text style={styles.noNotesText}>No notes available.</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNoteItem}
          ListEmptyComponent={<Text>No notes available</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "flex-start",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#762963",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    verticalAlign: "middle",
    fontSize: 22,
    color: "white",
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  noNotesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noNotesText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default App;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Client, Category, Note } from "../models/models";

export interface NoteFormProps {
  clients: Client[];
  categories: Category[];
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (newNote: Note) => void;
  saveButtonText: string;
  initialNote?: Note | null;
}

const NoteForm: React.FC<NoteFormProps> = ({
  clients,
  categories,
  isVisible,
  onClose,
  onSubmit,
  saveButtonText,
  initialNote,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    initialNote
      ? clients.find((client) => client.id === initialNote.clientId) || null
      : null
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialNote
      ? categories.find((category) => category.id === initialNote.categoryId) ||
          null
      : null
  );
  const [noteText, setNoteText] = useState(initialNote ? initialNote.text : "");
  const [clientError, setClientError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [noteTextError, setNoteTextError] = useState<string | null>(null);

  const handleAddOrUpdateNote = async () => {
    setClientError(null);
    setCategoryError(null);
    setNoteTextError(null);

    if (selectedClient && selectedCategory && noteText) {
      const newNote: Note = {
        id: initialNote ? initialNote.id : Date.now(),
        clientId: selectedClient.id,
        categoryId: selectedCategory.id,
        text: noteText,
      };

      // Log all current notes
      const allNotesJson = await AsyncStorage.getItem("@notes");
      const allNotes = allNotesJson ? JSON.parse(allNotesJson) : [];

      if (initialNote) {
        const updatedNotes = allNotes.map((note: Note) => {
          return note.id === initialNote.id ? newNote : note;
        });

        // Save the updated notes back to AsyncStorage
        await AsyncStorage.setItem("@notes", JSON.stringify(updatedNotes));
      } else {
        // Adding a new note
        const existingNotesJson = await AsyncStorage.getItem("@notes");
        const existingNotes: Note[] = existingNotesJson
          ? JSON.parse(existingNotesJson)
          : [];
        const updatedNotes = [...existingNotes, newNote];

        // Save the updated notes back to AsyncStorage
        await AsyncStorage.setItem("@notes", JSON.stringify(updatedNotes));
      }

      // Reset state variables after submitting the note
      setSelectedClient(null);
      setSelectedCategory(null);
      setNoteText("");
      // Close the modal after submitting
      onClose();
    } else {
      // Handle validation errors
      if (!selectedClient) {
        setClientError("Please select a client.");
      }
      if (!selectedCategory) {
        setCategoryError("Please select a category.");
      }
      if (!noteText) {
        setNoteTextError("A note body is required.");
      }
    }
  };

  useEffect(() => {
    setClientError(null);
    setCategoryError(null);
    setNoteTextError(null);
    if (initialNote) {
      const clientForNote =
        clients.find((client) => client.id === initialNote.clientId) || null;
      const categoryForNote =
        categories.find((category) => category.id === initialNote.categoryId) ||
        null;

      setSelectedClient(clientForNote);
      setSelectedCategory(categoryForNote);
      setNoteText(initialNote.text);
    }
  }, [initialNote, clients, categories]);
  useEffect(() => {
    // Clear error messages when the modal visibility changes
    setClientError(null);
    setCategoryError(null);
    setNoteTextError(null);
  }, [isVisible]);

  return (
    <Modal visible={isVisible} onRequestClose={onClose} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.headerText}>
          {initialNote ? "Editing Note" : "Create Note"}
        </Text>
        <View style={styles.pickerContainer}>
          {/* Client Picker */}
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerLabelText}>Select Client</Text>
            <Picker
              selectedValue={selectedClient?.id}
              onValueChange={(itemValue: number | string) => {
                const selectedClientObject = clients.find(
                  (client) => client.id === Number(itemValue)
                );
                setSelectedClient(selectedClientObject || null);
              }}
            >
              <Picker.Item label="Select a client" value={undefined} />
              {clients.map((client) => (
                <Picker.Item
                  key={client.id}
                  label={client.name}
                  value={client.id}
                />
              ))}
            </Picker>
            <Text style={styles.errorText}>{clientError}</Text>
          </View>
          {/* Category Picker */}
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerLabelText}>Select Category</Text>
            <Picker
              selectedValue={selectedCategory?.id}
              onValueChange={(itemValue: number | string) => {
                const selectedCategoryObject = categories.find(
                  (category) => category.id === Number(itemValue)
                );
                setSelectedCategory(selectedCategoryObject || null);
              }}
            >
              <Picker.Item label="Select a category" value={undefined} />
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
            <Text style={styles.errorText}>{categoryError}</Text>
          </View>
        </View>

        {/* Note Text Input */}
        <TextInput
          placeholder="Enter note text"
          value={noteText}
          onChangeText={(text) => setNoteText(text)}
          multiline // Allow multiple lines
          style={styles.noteTextInput}
        />
        <Text style={styles.errorText}>{noteTextError}</Text>

        <View style={styles.buttonContainer}>
          {/* Add or Update Note Button */}
          <Pressable
            onPress={handleAddOrUpdateNote}
            style={styles.createButton}
          >
            <Text>{saveButtonText}</Text>
          </Pressable>

          {/* Cancel Button */}
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-end",
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },
  pickerColumn: {
    flex: 1,
    marginRight: 10,
  },
  pickerLabelText: {
    marginBottom: 5,
  },
  noteTextInput: {
    height: 150,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    verticalAlign: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  createButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "lightgreen",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "lightcoral",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});

export default NoteForm;

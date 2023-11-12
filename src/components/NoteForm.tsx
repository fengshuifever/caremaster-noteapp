import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Client {
    id: number;
    name: string;
  }
  
  interface Category {
    id: number;
    name: string;
  }
  
  interface Note {
    id: number;
    clientId: number;
    categoryId: number;
    text: string;
  }
  
  interface NoteFormProps {
    clients: Client[];
    categories: Category[];
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (newNote: Note) => void;
    saveButtonText: string;
    initialNote?: Note | null; // Change this line to allow null
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
        initialNote ? clients.find((client) => client.id === initialNote.clientId) || null : null
      );
      const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        initialNote ? categories.find((category) => category.id === initialNote.categoryId) || null : null
      );
      const [noteText, setNoteText] = useState(initialNote ? initialNote.text : '');
  
    const handleAddOrUpdateNote = async () => {
        if (selectedClient && selectedCategory && noteText) {
          const newNote: Note = {
            id: initialNote ? initialNote.id : Date.now(),
            clientId: selectedClient.id,
            categoryId: selectedCategory.id,
            text: noteText,
          };
      
          // Log all current notes
          const allNotesJson = await AsyncStorage.getItem('@notes');
          const allNotes = allNotesJson ? JSON.parse(allNotesJson) : [];
          
          if (initialNote) {
            console.log('an existing note')
            // Editing an existing note
            const updatedNotes = allNotes.map((note: Note) => {
                console.log(note.id, initialNote.id);
                return note.id === initialNote.id ? newNote : note;
            });
      
            // Save the updated notes back to AsyncStorage
            await AsyncStorage.setItem('@notes', JSON.stringify(updatedNotes));
          } else {
            // Adding a new note
            console.log('new note')
            const existingNotesJson = await AsyncStorage.getItem('@notes');
            const existingNotes: Note[] = existingNotesJson ? JSON.parse(existingNotesJson) : [];
            const updatedNotes = [...existingNotes, newNote];
      
            // Save the updated notes back to AsyncStorage
            await AsyncStorage.setItem('@notes', JSON.stringify(updatedNotes));
          }
      
          
      
          // Reset state variables after submitting the note
          setSelectedClient(null);
          setSelectedCategory(null);
          setNoteText('');
          console.log("All current notes:", allNotes);
          // Close the modal after submitting
          onClose();
        } else {
          // Handle validation errors or show an alert
          Alert.alert('Validation Error', 'Please fill in all fields.');
        }
      };
  
      useEffect(() => {
        if (initialNote) {
          const clientForNote = clients.find((client) => client.id === initialNote.clientId) || null;
          const categoryForNote = categories.find((category) => category.id === initialNote.categoryId) || null;
      
          setSelectedClient(clientForNote);
          setSelectedCategory(categoryForNote);
          setNoteText(initialNote.text);
        }
      }, [initialNote, clients, categories]);
    useEffect(() => {
      console.log('Initial Note:', initialNote);
    }, [initialNote]);
  
    useEffect(() => {
      console.log('Selected Client:', selectedClient);
      console.log('Selected Category:', selectedCategory);
      console.log('Note Text:', noteText);
    }, [selectedClient, selectedCategory, noteText]);
  
    return (
        <Modal visible={isVisible} onRequestClose={onClose} animationType="slide">
          <View style={styles.container}>
            <Text style={styles.headerText}>{initialNote ? 'Editing Note' : 'Create Note'}</Text>
    
            {/* Client Picker */}
            <Text style={styles.pickerLabel}>Select Client</Text>
            <Picker
              selectedValue={selectedClient?.id}
              onValueChange={(itemValue: number | string) => {
                const selectedClientObject = clients.find((client) => client.id === Number(itemValue));
                setSelectedClient(selectedClientObject || null);
              }}
            >
              <Picker.Item label="Select a client" value={undefined} />
              {clients.map((client) => (
                <Picker.Item key={client.id} label={client.name} value={client.id} />
              ))}
            </Picker>
    
            {/* Category Picker */}
            <Text style={styles.pickerLabel}>Select Category</Text>
            <Picker
              selectedValue={selectedCategory?.id}
              onValueChange={(itemValue: number | string) => {
                const selectedCategoryObject = categories.find((category) => category.id === Number(itemValue));
                setSelectedCategory(selectedCategoryObject || null);
              }}
            >
              <Picker.Item label="Select a category" value={undefined} />
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>
    
            {/* Note Text Input */}
            <TextInput
              placeholder="Enter note text"
              value={noteText}
              onChangeText={(text) => setNoteText(text)}
              multiline // Allow multiple lines
              style={styles.noteTextInput}
            />
    
            {/* Add or Update Note Button */}
            <Pressable onPress={handleAddOrUpdateNote} style={styles.button}>
              <Text>{saveButtonText}</Text>
            </Pressable>
    
            {/* Cancel Button */}
            <Pressable onPress={onClose} style={styles.button}>
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </Modal>
      );
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    pickerLabel: {
      alignSelf: 'flex-start',
      marginLeft: 10,
    },
    noteTextInput: {
      height: 100, // Set the height to your desired size
      borderColor: 'gray',
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      verticalAlign: 'top', // Align text to the top of TextInput
    },
    button: {
      marginTop: 16,
      padding: 10,
      backgroundColor: 'lightblue',
      borderRadius: 5,
    },
  });
  
  export default NoteForm;

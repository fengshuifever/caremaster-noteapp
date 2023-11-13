import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Note } from "../models/models";
import Icon from "react-native-vector-icons/FontAwesome";

interface NoteListItemProps {
  note: Note;
  clientName: string;
  categoryName: string;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

const NoteListItem: React.FC<NoteListItemProps> = ({
  note,
  clientName,
  categoryName,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.clientText}>Client: {clientName}</Text>
        <Text style={styles.categoryText}>Category: {categoryName}</Text>
        <Text style={styles.noteText}>{note.text}</Text>
      </View>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.editButton} onPress={() => onEdit(note)}>
          <Icon name="pencil" size={20} color="white" />
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={() => onDelete(note)}>
          <Icon name="times" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  textContainer: {
    flexShrink: 1,
    flex: 1,
  },
  clientText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  noteText: {
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "green",
    padding: 10,
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NoteListItem;

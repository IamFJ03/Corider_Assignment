import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import img1 from '../assets/image1.jpg';
import img2 from '../assets/image2.jpg';
import img3 from '../assets/image3.jpg';
import img4 from '../assets/image4.jpg';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [showPicture, setShowPicture] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const fetchMessages = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://qa.corider.in/assignment/chat?page=${page}`);
      if (res.data?.chats?.length) {
        setMessages(prev => [...res.data.chats.reverse(), ...prev]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('API error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const newMessage = {
      id: Date.now(),
      message: inputMessage,
      sender: { self: true }
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender.self ? styles.self : styles.other]}>
      <Text style={[styles.messageText, item.sender.self ? styles.selfText : styles.otherText]}>
        {item.message}
      </Text>
    </View>
  );

  const renderFooter = () =>
    loading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color="#555" />
      </View>
    ) : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={{ top: 12 }}>
            <TouchableOpacity style={styles.backButton}>
              <Icon name="arrow-back" size={30} color="black" style={{ marginVertical: 5 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPicture(true)} style={styles.imageGroup}>
              <View style={styles.imageRow}>
                <Image source={img1} style={styles.smallImage} />
                <Image source={img2} style={styles.smallImage} />
              </View>
              <View style={styles.imageRow}>
                <Image source={img3} style={styles.smallImage} />
                <Image source={img4} style={styles.smallImage} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.tripTitle}>Trip 1</Text>
              <Icon2 name="square-edit-outline" size={30} color="black" style={{ left: 230 }} />
            </View>
            <View style={{ top: 15 }}>
              <Text style={styles.subHeader}>
                From <Text style={{ fontWeight: 'bold' }}>IGI Airport, T3</Text>
              </Text>
              <Text style={styles.subHeader}>
                To <Text style={{ fontWeight: 'bold' }}>Sector 28</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={{ top: 40 }}>
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Icon name="more-vert" size={30} color="black" />
          </TouchableOpacity>

          {showMenu && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity onPress={() => console.log('Members')} style={styles.menuItem}>
                <Icon2 name="account-group-outline" size={30} color="black" />
                <Text style={{ top: 5, fontSize: 17, fontWeight: 'bold' }}>Members</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Share Number')} style={styles.menuItem}>
                <Icon2 name="phone-outline" size={30} color="black" />
                <Text style={{ top: 5, fontSize: 17, fontWeight: 'bold' }}>Share Number</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Report')} style={styles.menuItem}>
                <Icon2 name="alert-outline" size={30} color="black" />
                <Text style={{ top: 5, fontSize: 17, fontWeight: 'bold' }}>Report</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Modal visible={showPicture} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowPicture(false)}
          activeOpacity={1}
        >
          <View>
            <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Group Members</Text>
            <View style={styles.imageGroup}>
              <View style={styles.imageRow}>
                <Image source={img1} style={styles.bigImage} />
                <Image source={img2} style={styles.bigImage} />
              </View>
              <View style={styles.imageRow}>
                <Image source={img3} style={styles.bigImage} />
                <Image source={img4} style={styles.bigImage} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <FlatList
        inverted
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={fetchMessages}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputContainer}>
        {showActions && (
          <View style={styles.actionBubble}>
            <TouchableOpacity style={styles.actionIcon}>
              <Icon2 name="camera-outline" size={27} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon}>
              <Icon2 name="video-outline" size={27} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon}>
              <Icon2 name="file-document-outline" size={27} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Reply to @Rohit Yadav"
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity onPress={() => setShowActions(!showActions)} style={styles.iconButton}>
          <Icon name="attach-file" size={24} color="#444" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend}>
          <Icon name="send" size={24} color="#444" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 15,
    height: 150,
    backgroundColor: '#f3f3f3',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    marginRight: 10,
  },

  tripTitle: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  subHeader: {
    fontSize: 20,
    color: '#444',
  },
  dropdownMenu: {
    width: 180,
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 6,
    padding: 8,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageContainer: {
    marginVertical: 4,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  self: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
  },
  messageText: {
    fontSize: 17,
  },
  selfText: {
    color: 'white',
  },
  otherText: {
    color: 'black',
  },
  loading: {
    padding: 10,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  actionBubble: {
    position: 'absolute',
    bottom: 60,
    right: 15,
    backgroundColor: '#0A8F37',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    zIndex: 10,
    alignItems: 'center',
  },
  actionIcon: {
    marginHorizontal: 6,
  },
  iconButton: {
    paddingHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGroup: {
    width: 45,
    height: 45,
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10
  },
  imageRow: {
    flexDirection: 'row',
  },
  smallImage: {
    width: 20,
    height: 20,
    margin: 0.5,
    borderRadius: 3,
  },
});

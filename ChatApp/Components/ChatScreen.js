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
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import user from '../assets/OIP.jpeg';

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="black" style={{ marginTop:5, marginBottom:5 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowPicture(true)}>
            <Image source={user} style={{ height: 25, width: 25, borderRadius: 50 }} />
          </TouchableOpacity>
</View>
          <View>
            <Text style={styles.tripTitle}>Trip 1</Text>
            <Text style={styles.subHeader}>From IGI Airport, T3 To Sector 28</Text>
          </View>
        </View>

        {/* Custom Menu */}
        <View>
          <TouchableOpacity onPress={() => setShowMenu(prev => !prev)}>
            <Icon name="more-vert" size={24} color="black" />
          </TouchableOpacity>

          {showMenu && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity onPress={() => console.log('Members')} style={{paddingVertical:5, borderBottomWidth: 1,borderBottomColor:'grey'}}><Text>Members</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Share Number')}  style={{paddingVertical:5, borderBottomWidth: 1,borderBottomColor:'grey'}}><Text>Share Number</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Report')}  style={{paddingVertical:5}}><Text>Report</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Profile Picture Modal */}
      <Modal visible={showPicture} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowPicture(false)}
          activeOpacity={1}
        >
          <Image source={user} style={styles.modalImage} />
        </TouchableOpacity>
      </Modal>

      {/* Chat List */}
      <FlatList
        inverted
        data={[...messages].reverse()}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={fetchMessages}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        {showActions && (
          <View style={styles.actionBubble}>
            <TouchableOpacity style={styles.actionIcon}>
              <Icon name="photo-camera" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon}>
              <Icon name="videocam" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon}>
              <Icon name="insert-drive-file" size={20} color="#fff" />
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
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 15,
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
    fontSize: 18,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 13,
    color: '#444',
  },
  dropdownMenu: {
    width:120,
    
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 6,
    padding: 8,
    zIndex: 10,
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
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 15,
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
    left: 290,
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
  modalImage: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
});

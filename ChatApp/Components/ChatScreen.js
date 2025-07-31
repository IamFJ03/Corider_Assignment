import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
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
  const [inputMessage, setInputMessage] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPicture, setShowPicture] = useState(false);

  const inputRef = useRef(null);

  const fetchMessages = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://qa.corider.in/assignment/chat?page=${page}`);
      const newMessages = res.data.chats;
      if (newMessages.length > 0) {
        setMessages(prev => [...newMessages.reverse(), ...prev]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
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
      sender: { self: true },
    };
    setMessages(prev => [newMessage, ...prev]); // Adds at top (which appears at bottom of screen due to inverted)

    setInputMessage('');
  };

  const formatTime = timestamp => {
    if (!timestamp) return '';
    const [_, timePart] = timestamp.split(' ');
    const [hour, minute] = timePart.split(':');
    return `${hour}:${minute}`;
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageRow, item.sender.self ? styles.rowReverse : null]}>
      {!item.sender.self && item.sender.image && (
        <Image source={{ uri: item.sender.image }} style={styles.avatar} />
      )}
      <View>
        <View style={[styles.messageContainer, item.sender.self ? styles.self : styles.other]}>
          <Text style={[styles.messageText, item.sender.self ? styles.selfText : styles.otherText]}>
            {item.message.replace(/<br\s*\/?>/gi, '\n')}
          </Text>
        </View>
        {item.time && (
          <Text
            style={[
              styles.timestampText,
              item.sender.self ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
            ]}
          >
            {formatTime(item.time)}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={{top:-5}}>
                <TouchableOpacity style={styles.backButton}>
                  <Icon name="arrow-back" size={30} color="black" />
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
              <View style={{ marginTop: -30 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.tripTitle}>Trip 1</Text>
                  <Icon2 name="square-edit-outline" size={30} color="black" style={{ left: 215 }} />
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
            <View style={{top:20,left:0  }}>
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                <Icon name="more-vert" size={30} color="black" />
              </TouchableOpacity>
              {showMenu && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity style={styles.menuItem}>
                    <Icon2 name="account-group-outline" size={20} color="black" />
                    <Text style={styles.menuText}>Members</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Icon2 name="phone-outline" size={20} color="black" />
                    <Text style={styles.menuText}>Share Number</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Icon2 name="alert-outline" size={20} color="black" />
                    <Text style={styles.menuText}>Report</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Modal for Picture */}
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

          {/* Chat List */}
          <FlatList
            inverted
            data={messages}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            onEndReached={fetchMessages}
            onEndReachedThreshold={0.2}
            contentContainerStyle={{ paddingBottom: 10 }}
            ListFooterComponent={loading ? <ActivityIndicator size="small" color="#555" /> : null}
            style={{ flex: 1 }}
          />

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Reply to @Rohit Yadav"
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholderTextColor="#999"
              onFocus={() => console.log('Input focused')}
            />
            <TouchableOpacity onPress={() => setShowActions(!showActions)} style={styles.iconButton}>
              <Icon name="attach-file" size={22} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
              <Icon name="send" size={22} color="#444" />
            </TouchableOpacity>
            {showActions && (
              <View style={styles.actionBubble}>
                <TouchableOpacity style={styles.actionIcon}>
                  <Icon2 name="camera-outline" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                  <Icon2 name="video-outline" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                  <Icon2 name="file-document-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{height:40}}></View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(255, 250, 245, 1)' },
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
    fontSize: 24,
    fontWeight:700
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 500,
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    minWidth: '25%'
  },
  self: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    elevation:10
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    elevation:10
  },
  messageText: {
    fontSize: 14,
    fontWeight:400
  },
  selfText: {
    
    color: 'white',
  },
  otherText: {
    color: 'black',
  },
  inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  width:'90%',
  left:'5%',
  padding: 10,
  
  borderTopWidth: 1,
  borderColor: '#eee',
  backgroundColor: '#fff',
},


input: {
  flex: 1,
  backgroundColor:'white',
  paddingHorizontal: 15,
  backgroundColor: '#f5f5f5',
  marginRight: 6,
  fontSize: 14,
},

iconButton: {
  paddingHorizontal: 6,
},

actionBubble: {
  position: 'absolute',
  bottom: 65,
  right:2,
  height:44,
  width:124,
  backgroundColor: '#0A8F37',
  flexDirection: 'row',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 22,
  elevation: 5,
  zIndex: 10,
  alignItems: 'center',
},

actionIcon: {
  marginHorizontal: 6,
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
    marginTop: 15,
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
  bigImage: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 10,
  },
  messageRow: {
    flexDirection: 'row',
   
    marginHorizontal: 10,
    marginVertical: 6,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    position:'relative',
    top:10,
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  timestampContainer: {
    position:'relative',
    top:260,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 10,
  marginHorizontal: 10,
},

timestampText: {
  fontSize: 14,
  color: '#888',
  marginTop: 2,
  marginHorizontal: 4,
},

line: {
  flex: 1,
  height: 1,
  backgroundColor: '#ccc',
},

});
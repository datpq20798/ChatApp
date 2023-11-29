import firebase, { db } from './config';

//Gen trường key trong users
export const getNextUserKey = async () => {
  const usersRef = db.collection('users');
  

  const snapshot = await usersRef.orderBy('key', 'desc').limit(1).get();
 

  if (snapshot.empty) {
    return 1; // Nếu không có người dùng nào trong Firestore, key bắt đầu từ 1
  } else {
    const lastUser = snapshot.docs[0].data();
    return lastUser.key + 1; // Trả về key tiếp theo
  }
};

export const getNextRoomKey = async () => {
  const roomsRef = db.collection('rooms');
 
  

  const snapshot = await roomsRef.orderBy('key', 'desc').limit(1).get();
 

  if (snapshot.empty) {
    return 1;
  } else {
    const lastRoom = snapshot.docs[0].data();
    return lastRoom.key + 1; // Trả về key tiếp theo
  }

}

//add thông tin vào firestore
export const addDocument = async (collection, data) => {
  const query = db.collection(collection);


  query.add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),

  });
};

// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName) => {
  // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
  // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
  const name = displayName.split(' ').filter((word) => word);

  const length = name.length;
  let flagArray = [];
  let result = [];
  let stringArray = [];

  /**
   * khoi tao mang flag false
   * dung de danh dau xem gia tri
   * tai vi tri nay da duoc su dung
   * hay chua
   **/
  for (let i = 0; i < length; i++) {
    flagArray[i] = false;
  }

  const createKeywords = (name) => {
    const arrName = [];
    let curName = '';
    name.split('').forEach((letter) => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  function findPermutation(k) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(' '));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

  const keywords = stringArray.reduce((acc, cur) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};

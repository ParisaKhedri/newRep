import { Sequelize, DataTypes } from 'sequelize';

import CONFIG from "./env.json" assert { type: 'json' };

const sequelize = new Sequelize(CONFIG.DB_NAME, CONFIG.DB_USER_NAME, CONFIG.DB_PASSWORD, {
  dialect: 'mariadb',
  dialectOptions: {
  }
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  profile_description: {
    type: DataTypes.TEXT('medium'),
  },
  profile_img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
});

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT('medium'),
    allowNull: true
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  public: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {

});

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  body: {
    type: DataTypes.TEXT('medium'),
    allowNull: false
  },
  journal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT("medium"),
    allowNull: false
  },
}, {

});

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
});

const UserConversation = sequelize.define('UserConversation', {
  
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  conversation_id : {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

const UserFollow = sequelize.define('UserFollow', {
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  followed_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

const Block = sequelize.define('Block', {
  blocker_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  blocked_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

const JournalFollow = sequelize.define('JournalFollow', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  journal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});


Journal.hasMany(JournalEntry, { foreignKey: 'journal_id' });
JournalEntry.belongsTo(Journal, {
  foreignKey: "journal_id",
  targetKey: "id"
});

User.hasMany(Journal, { foreignKey: 'author_id' });
Journal.belongsTo(User, {
  foreignKey: "author_id",
  targetKey: "id"
});

User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
});

Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, {
  foreignKey: 'conversation_id',
  targetKey: 'id',
});


User.belongsToMany(Conversation, { through: 'UserConversation', foreignKey: 'user_id' });
Conversation.belongsToMany(User, { through: 'UserConversation', foreignKey: 'conversation_id' });

User.belongsToMany(User, { through: 'UserFollow', as: "UserFollower", foreignKey: 'follower_id' });
User.belongsToMany(User, { through: 'UserFollow', as: "UserFollowed", foreignKey: 'followed_id' });

User.belongsToMany(User, { through: 'Block', as: "Blocker", foreignKey: 'blocker_id' });
User.belongsToMany(User, { through: 'Block', as: "Blocked", foreignKey: 'blocked_id' });

User.belongsToMany(Journal, { through: 'JournalFollow', as: "JournalFollower", foreignKey: 'user_id' });
Journal.belongsToMany(User, { through: 'JournalFollow', as: "FollowedJournal", foreignKey: 'journal_id' });

export const createTables = async function createTables() {
  try {
    /*let conn = await pool.getConnection();
    console.log("Hi");*/
    await sequelize.drop({ force: true});
    await sequelize.sync({ force: true });

  } catch (error) {
    console.log(error);
  }
}

export const getUserModel = User;
export const getJournalModel = Journal;
export const getJournalEntryModel = JournalEntry;
export const getMessageModel = Message;
export const getConversationModel = Conversation;
export const getUserConversationModel = UserConversation;
export const getUserFollowModel = UserFollow;
export const getBlockModel = Block;
export const getJournalFollowModel = JournalFollow;
//exports.getUserModel = User;
// exports.getJournalModel = Journal;
// exports.getJournalEntryModel = JournalEntry;
// exports.getMessageModel = Message;
// exports.getConversationModel = Conversation;
// exports.getUserConversationModel = UserConversation;
// exports.getUserFollowModel = UserFollow;
// exports.getBlockModel = Block;
// exports.getJournalFollowModel = JournalFollow;
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
export default (sequelize) => {
  class User extends Model {
    static associate() {
    }

    /**
     * Check if the given password is correct
     * @param {string} password User plain password
     * @returns {Promise<boolean>}
     */
    checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }

    /**
     * Check if the user is an admin
     * @returns {boolean}
     */
    isAdmin() {
      return this.role === 'ADMIN';
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isNotNull: function (value) {
            if (value === null) {
              throw new Error('Username cannot be null');
            }
          },
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
        },
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'PLAYER'),
        allowNull: false,
        defaultValue: 'PLAYER',
      },
      xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'users',
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
      },
      // getterMethods: {},
    },
  );

  /**
   * Encrypt the password before creating or updating the user
   * @param {User} user User model
   * @param {import('sequelize').UpdateOptions} [options] Update options
   */
  const encryptPassword = async (user, options) => {
    if (!options?.fields.includes('password')) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  };

  User.addHook('beforeCreate', encryptPassword);

  User.addHook('beforeUpdate', encryptPassword);

  return User;
};

import DAO from './dao';
import { ObjectId } from 'mongodb';

class TagDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async deleteTag(_id){
        let db = await super.open();

        await db.collection('tags').remove({ _id: ObjectId(_id), userId: this.userId });
    }
    async loadTags(userId){
        let db = await super.open();

        let userIdToUse = userId || this.userId;

        try {
            let [tags, labelColors] = await Promise.all([
                db.collection('tags').find({ userId: userIdToUse }).sort({ name: 1 }).toArray(),
                db.collection('labelColors').find({ }).sort({ order: 1 }).toArray()
            ]);

            return { tags, labelColors };
        } finally {
            super.dispose(db);
        }
    }
}


export default TagDAO;
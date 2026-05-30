const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

class StudentService {
    async findById(id) {
        return await Student.findOne({ id }).select('-password -__v');
    }

    async findForAuth(id) {
        return await Student.findOne({ id });
    }

    async findAll(query, skip, limit) {
        const students = await Student.find(query)
            .skip(skip)
            .limit(limit)
            .select('-password -__v');
        const total = await Student.countDocuments(query);
        return { students, total };
    }

    async createStudent(studentData) {
        const hashedPassword = await bcrypt.hash(studentData.password, 10);
        return await Student.create({
            ...studentData,
            password: hashedPassword
        });
    }

    async updateStudent(id, updateData) {
        if (updateData.password && updateData.password.trim() !== '') {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        return await Student.findOneAndUpdate(
            { id },
            updateData,
            { new: true, runValidators: true }
        ).select('-password -__v');
    }

    async updateManyResults(published) {
        return await Student.updateMany({}, { resultsPublished: published });
    }

    async updateOneResult(id, published) {
        return await Student.findOneAndUpdate(
            { id },
            { resultsPublished: published },
            { new: true }
        ).select('-password -__v');
    }

    async deleteStudent(id) {
        return await Student.findOneAndDelete({ id });
    }
}

module.exports = new StudentService();

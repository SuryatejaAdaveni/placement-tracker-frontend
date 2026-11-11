import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import style from "../Styles/managemockrating.module.css";
import axiosInstance from "../Api/axiosInstance";

const ManageMockRating = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [technology, setTechnology] = useState("");
  const [rating, setRating] = useState("");
  const [selectedMock, setSelectedMock] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchText = search.toLowerCase();

      return (
        student.name?.toLowerCase().includes(searchText) ||
        student.studentId?.toLowerCase().includes(searchText)
      );
    });
  }, [students, search]);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddMockRating = async (e) => {
    e.preventDefault();

    try {
      if (selectedMock) {
        await axiosInstance.put(`/api/mockrating/student/${selectedMock.id}`, {
          technology,
          rating: Number(rating),
        });

        toast.success("Mock Rating Updated Successfully");
      } else {
        await axiosInstance.post(
          `/api/mockrating/add/${selectedStudent.studentId}`,
          {
            technology,
            rating: Number(rating),
          },
        );

        toast.success("Mock Rating Added Successfully");
      }

      setTechnology("");
      setRating("");
      setSelectedStudent(null);
      setSelectedMock(null);

      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to save Mock Rating",
      );
    }
  };
  const handleUpdateMockRating = (student, mock) => {
    setSelectedStudent(student);
    setSelectedMock(mock);

    setTechnology(mock.technology);
    setRating(String(mock.rating));
  };
  const handleRemoveMockRating = async (id) => {
    try {
      await axiosInstance.delete(`/api/mockrating/${id}`);

      toast.success("Mock Rating Deleted Successfully");
      fetchStudents();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Unable to Remove Mock Rating",
      );
    }
  };

  return (
    <div className={style.mockRating}>
      <div className={style.pageHeader}>
        <div>
          <h2>Manage Students Mock Rating</h2>
          <p>View and manage registered students Mock Rating</p>
        </div>

        <button className={style.refreshBtn} onClick={fetchStudents}>
          ↻ Refresh
        </button>
      </div>

      <div className={style.filterSection}>
        <div className={style.searchStudents}>
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search Student By StudentId or Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              console.log(students);
            }}
          />
        </div>
      </div>

      <div className={style.cardContainer}>
        {loading ? (
          <p className={style.loadingMessage}>Loading Students........</p>
        ) : filteredStudents.length === 0 ? (
          <div className={style.filterErrorMessage}>
            <h2>No Students Found</h2>
            <p>There are No students Matching your search or filters</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div className={style.card} key={student.studentId}>
              <div className={style.studentInfoAndAddMock}>
                <div className={style.studentInfo}>
                  <div className={style.studentid}>{student.studentId}</div>
                  <div className={style.studentName}>{student.name}</div>
                </div>

                <button
                  className={style.addMockRatingButton}
                  onClick={() => setSelectedStudent(student)}
                >
                  + Add Mock Rating
                </button>
              </div>
              <div className={style.mockInfo}>
                {student.mockRating?.length > 0 ? (
                  student.mockRating.map((mock) => (
                    <div className={style.mockRatingSection} key={mock.id}>
                      <div>
                        <span>{mock.technology}</span>
                        <span>{mock.rating}/10</span>
                      </div>
                      <div className={style.actionbuttons}>
                        <button
                          className={style.updateButton}
                          onClick={() => handleUpdateMockRating(student, mock)}
                        >
                          Update
                        </button>
                        <button
                          className={style.removeButton}
                          onClick={() => {
                            handleRemoveMockRating(mock.id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No Mock Ratings Available</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedStudent && (
        <div
          className={style.overlay}
          onClick={() => {
            setSelectedStudent(null);
            setSelectedMock(null);
            setTechnology("");
            setRating("");
          }}
        >
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMock ? "Update Mock Rating" : "Add Mock Rating"}</h2>

            <p>Student ID: {selectedStudent.studentId}</p>
            <p>Name: {selectedStudent.name}</p>

            <form onSubmit={handleAddMockRating}>
              <div className={style.formGroup}>
                <label>Technology</label>
                <input
                  type="text"
                  placeholder="Enter Technology"
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label>Rating (Out of 10)</label>
                <input
                  type="number"
                  placeholder="Enter Rating"
                  min="0"
                  max="10"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                />
              </div>

              <div className={style.formButtons}>
                <button type="submit" className={style.submitButton}>
                  {selectedMock ? "Update Rating" : "Add Rating"}
                </button>

                <button
                  type="button"
                  className={style.cancelButton}
                  onClick={() => {
                    setSelectedStudent(null);
                    setSelectedMock(null);
                    setTechnology("");
                    setRating("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMockRating;

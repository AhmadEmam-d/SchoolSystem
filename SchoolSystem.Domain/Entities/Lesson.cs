using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Domain.Entities
{
    public class Lesson : BaseEntity
    {
        public string Title { get; set; }                
        public string Description { get; set; }      
        public DateTime Date { get; set; }         
        public DateTime StartTime { get; set; }        
        public DateTime EndTime { get; set; }           
        public int Duration { get; set; }           
        public LessonStatus Status { get; set; }     
        public LessonType Type { get; set; }       

        public Guid ClassOid { get; set; }              
        public Class Class { get; set; }

        public Guid TeacherOid { get; set; }           
        public Teacher Teacher { get; set; }

        public Guid SubjectOid { get; set; }            
        public Subject Subject { get; set; }

        public ICollection<LessonMaterial> Materials { get; set; } = new List<LessonMaterial>();

        public ICollection<LessonObjective> Objectives { get; set; } = new List<LessonObjective>();

        public ICollection<LessonHomework> Homeworks { get; set; } = new List<LessonHomework>();
    }

   
}
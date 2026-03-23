using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Interfaces.Common
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T?> GetByOidAsync(Guid oid);
        Task<IEnumerable<T>> GetAllAsync();
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(Guid oid);
        IQueryable<T> GetAllQueryable();
        Task<T> CreateAsync(T entity);
    }
}

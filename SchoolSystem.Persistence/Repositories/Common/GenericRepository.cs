using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;
using SchoolSystem.Persistence.Contexts;

namespace SchoolSystem.Persistence.Repositories.Common
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly AppDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }
        public virtual async Task<T?> GetByOidAsync(Guid oid)
        {
            return await _dbSet
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => EF.Property<Guid>(e, "Oid") == oid);
        }
        public virtual async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            _context.Entry(entity).State = EntityState.Detached;
        }

        public virtual async Task DeleteAsync(Guid oid)
        {
            var entity = await _dbSet.FindAsync(oid);
            if (entity is not null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.AsNoTracking().ToListAsync();
        }


        public virtual async Task UpdateAsync(T entity)
        {
            var local = _context.ChangeTracker.Entries<T>()
                    .FirstOrDefault(e => e.Entity.Oid == entity.Oid);

            if (local != null)
                _context.Entry(local.Entity).State = EntityState.Detached;

            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            _context.Entry(entity).State = EntityState.Detached;
        }

        public virtual IQueryable<T> GetAllQueryable()
        {
            return _dbSet.AsNoTracking();
        }
        public async Task<T> CreateAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            _context.Entry(entity).State = EntityState.Detached;
            return entity;
        }
    }
}

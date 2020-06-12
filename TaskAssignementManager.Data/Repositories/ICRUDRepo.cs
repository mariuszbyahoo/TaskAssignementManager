using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TaskAssignementManager.Data
{
    public interface ICRUDRepo<T>
    {
        TasksDbContext Ctx { get; set; }
        /// <summary>
        /// Add a new entity of type T
        /// </summary>
        /// <param name="entity">An entity to add</param>
        /// <returns></returns>
        Task<T> AddEntity(T entity);

        /// <summary>
        /// Update an existing entity with new data
        /// </summary>
        /// <param name="entity">New data to update with</param>
        /// <returns></returns>
        Task<T> UpdateEntity(T entity);

        /// <summary>
        /// Deletes an entity from repo
        /// </summary>
        /// <param name="entity">Entity to delete</param>
        /// <returns></returns>
        Task DeleteEntity(T entity);

        /// <summary>
        /// Gets an specific entity
        /// </summary>
        /// <param name="entityId">Id of an entity to return</param>
        /// <returns></returns>
        T GetEntity(Guid entityId);

        /// <summary>
        /// Gets all available entites
        /// </summary>
        /// <returns></returns>
        Task<T[]> GetEntites();
    }
}

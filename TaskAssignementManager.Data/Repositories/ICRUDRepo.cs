using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Text;

namespace TaskAssignementManager.Data.Repositories
{
    public interface ICRUDRepo<T>
    {
        DbContext Ctx { get; set; }
        /// <summary>
        /// Add a new entity of type T
        /// </summary>
        /// <param name="entity">An entity to add</param>
        /// <returns></returns>
        ActionResult<T> AddEntity(T entity);

        /// <summary>
        /// Update an existing entity with new data
        /// </summary>
        /// <param name="entityId">ID of an entity to update</param>
        /// <param name="newEntity">New data to update with</param>
        /// <returns></returns>
        ActionResult<T> UpdateEntity(Guid entityId, T newEntity);

        /// <summary>
        /// Deletes an entity from repo
        /// </summary>
        /// <param name="entityId">Id of an entity to delete</param>
        /// <returns></returns>
        IActionResult DeleteEntity(Guid entityId);

        /// <summary>
        /// Gets an specific entity
        /// </summary>
        /// <param name="entityId">Id of an entity to return</param>
        /// <returns></returns>
        ActionResult<T> GetEntity(Guid entityId);

        /// <summary>
        /// Gets all available entites
        /// </summary>
        /// <returns></returns>
        ActionResult<ICollection<T>> GetEntites();
    }
}

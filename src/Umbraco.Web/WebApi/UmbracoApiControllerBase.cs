using System;
using System.Web;
using System.Web.Http;
using Microsoft.Owin;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.Services;
using Umbraco.Web.Security;

namespace Umbraco.Web.WebApi
{
    /// <summary>
    /// The base class for API controllers that expose Umbraco services - THESE ARE NOT AUTO ROUTED
    /// </summary>
    public abstract class UmbracoApiControllerBase : ApiController
    {
        protected UmbracoApiControllerBase()
            : this(UmbracoContext.Current)
        {

        }

        protected UmbracoApiControllerBase(UmbracoContext umbracoContext)
        {
            if (umbracoContext == null) throw new ArgumentNullException("umbracoContext");
            UmbracoContext = umbracoContext;
            InstanceId = Guid.NewGuid();
            Umbraco = new UmbracoHelper(umbracoContext);
            _membershipHelper = new MembershipHelper(UmbracoContext);
        }

        private readonly MembershipHelper _membershipHelper;

        /// <summary>
        /// Tries to retrieve the current HttpContext if one exists.
        /// </summary>
        /// <returns></returns>
        protected Attempt<HttpContextBase> TryGetHttpContext()
        {
            return Request.TryGetHttpContext();
        }

        /// <summary>
        /// Tries to retrieve the current HttpContext if one exists.
        /// </summary>
        /// <returns></returns>
        protected Attempt<IOwinContext> TryGetOwinContext()
        {
            return Request.TryGetOwinContext();
        }

        /// <summary>
        /// Returns an ILogger
        /// </summary>
        public ILogger Logger
        {
            get { return ProfilingLogger.Logger; }
        }

        /// <summary>
        /// Returns a ProfilingLogger
        /// </summary>
        public ProfilingLogger ProfilingLogger
        {
            get { return UmbracoContext.Application.ProfilingLogger; }
        }

        /// <summary>
        /// Returns the current ApplicationContext
        /// </summary>
        public ApplicationContext ApplicationContext
        {
            get { return UmbracoContext.Application; }
        }

        /// <summary>
        /// Returns a ServiceContext
        /// </summary>
        public ServiceContext Services
        {
            get { return ApplicationContext.Services; }
        }

        /// <summary>
        /// Returns a DatabaseContext
        /// </summary>
        public DatabaseContext DatabaseContext
        {
            get { return ApplicationContext.DatabaseContext; }
        }

        /// <summary>
        /// Returns an UmbracoHelper object
        /// </summary>
        public UmbracoHelper Umbraco { get; private set; }

        /// <summary>
        /// Returns the current UmbracoContext
        /// </summary>
        public UmbracoContext UmbracoContext { get; private set; }

        /// <summary>
        /// Returns the WebSecurity instance
        /// </summary>
        public WebSecurity Security
        {
            get { return UmbracoContext.Security; }
        }

        /// <summary>
        /// Returns the MemberHelper instance
        /// </summary>
        public MembershipHelper Members
        {
            get { return _membershipHelper; }
        }

        /// <summary>
        /// Useful for debugging
        /// </summary>
        internal Guid InstanceId { get; private set; }
    }
}
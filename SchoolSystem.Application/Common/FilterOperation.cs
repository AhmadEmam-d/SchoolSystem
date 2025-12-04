using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Common
{
    public enum FilterOperation
    {
        Equals,
        NotEquals,
        Contains,
        StartsWith,
        EndsWith,
        GreaterThan,
        LessThan,
        GreaterThanOrEqual,
        LessThanOrEqual
    }
}



export function formatZodErrors(issues: any[]) {
    const errors: Record<string, string> = {}

    issues.forEach(((issue) => {
        const field = issue.path[0]

        if (field && !errors[field]) {
            errors[field] = issue.message
        }
    }))
    return errors
}
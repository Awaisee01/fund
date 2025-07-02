
# Admin Dashboard Components

This directory contains all the components for the admin dashboard, organized into focused, reusable modules.

## Component Structure

### Core Dashboard Components
- `AdminDashboard.tsx` - Main dashboard container with state management
- `AdminDashboardHeader.tsx` - Header with navigation and controls
- `StatsOverview.tsx` - Statistics cards display
- `SubmissionsTable.tsx` - Main table for form submissions
- `SubmissionDetailModal.tsx` - Modal for viewing/editing submission details

### Bulk Actions
- `BulkActions.tsx` - Container for bulk operation controls
- `BulkActions/BulkActionHeader.tsx` - Selection controls and counter
- `BulkActions/BulkActionButtons.tsx` - Action buttons for bulk operations
- `BulkActions/BulkStatusDialog.tsx` - Dialog for bulk status updates
- `BulkActions/BulkNotesDialog.tsx` - Dialog for bulk notes addition

### Feature Components
- `SearchFilter.tsx` - Debounced search input with icon
- `PaginationControls.tsx` - Pagination with page size controls
- `BulkEmailDialog.tsx` - Bulk email sending functionality
- `WorkflowTrigger.tsx` - Automated workflow execution
- `ConfirmationDialog.tsx` - Reusable confirmation dialog
- `DashboardAnalytics.tsx` - Analytics charts and metrics
- `DateRangeFilter.tsx` - Date range filtering
- `EmailIntegration.tsx` - Email sending integration
- `ExportControls.tsx` - Data export functionality

## Hooks
- `useAdminDashboard.ts` - Custom hook for dashboard state management

## Testing
- `__tests__/` - Unit tests for components
- Test files follow the pattern `ComponentName.test.tsx`

## Key Features

### Performance Optimizations
- Debounced search with 300ms delay
- Memoized filtering and pagination
- Virtual scrolling support for large datasets
- Efficient re-rendering with proper dependency arrays

### User Experience
- Confirmation dialogs for destructive actions
- Loading states and error handling
- Responsive design with mobile support
- Keyboard navigation support

### Bulk Operations
- Multi-selection with select all/none
- Bulk status updates with confirmation
- Bulk email sending to selected submissions
- Automated workflow triggers
- Bulk notes addition

### Analytics & Reporting
- Real-time statistics dashboard
- Date range filtering
- Export functionality (CSV, Excel)
- Visual charts and metrics

## Usage Examples

### Basic Dashboard Setup
```tsx
import AdminDashboard from './components/AdminDashboard';

function App() {
  const handleLogout = () => {
    // Handle logout logic
  };

  return <AdminDashboard onLogout={handleLogout} />;
}
```

### Using Individual Components
```tsx
import { SearchFilter, PaginationControls } from './components/admin';

function CustomTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <SearchFilter onSearch={setSearchQuery} />
      {/* Your table content */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

## Performance Considerations

- Components use React.memo where appropriate
- Expensive operations are memoized with useMemo
- Event handlers are properly memoized with useCallback
- Large lists use pagination to maintain performance
- Database queries are optimized with proper indexing

## Accessibility

- All interactive elements have proper ARIA labels
- Keyboard navigation is fully supported
- Color contrast meets WCAG guidelines
- Screen reader compatibility
- Focus management in modals and dialogs

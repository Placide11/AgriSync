from rest_framework import viewsets, generics, permissions
from .models import Task
from .serializers import TaskSerializer, TaskStatusUpdateSerializer
from .permissions import IsOwnerOrAdmin
from rest_framework.permissions import IsAuthenticated

class TaskViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing tasks.
    """
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

class TaskStatusUpdateAPIView(generics.UpdateAPIView):
    """
    Allows a user to update the status of a task they are assigned to.
    Uses PATCH for partial updates.
    """
    queryset = Task.objects.all()
    serializer_class = TaskStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
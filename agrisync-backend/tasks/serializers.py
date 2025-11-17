from rest_framework import serializers
from .models import Task
from core.models import User

class AssignedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = AssignedUserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='assigned_to',
        write_only=True,
        required=False
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to', 'assigned_to_id', 'due_date', 'status', 'created_at']

class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    """
    A serializer specifically for allowing a user to update only the status of a task.
    """
    class Meta:
        model = Task
        fields = ['status'] 
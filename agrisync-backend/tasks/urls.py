from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TaskViewSet, TaskStatusUpdateAPIView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('update-status/<int:pk>/', TaskStatusUpdateAPIView.as_view(), name='task-status-update')
]

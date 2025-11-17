from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import FieldViewSet, CropViewSet, AddInputToCropAPIView

router = DefaultRouter()
router.register(r'fields', FieldViewSet)
router.register(r'crops', CropViewSet)
# router.register(r'inputs', InputUsedViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('crops/<int:crop_pk>/add_input/', AddInputToCropAPIView.as_view(), name='add-input-to-crop'),
]

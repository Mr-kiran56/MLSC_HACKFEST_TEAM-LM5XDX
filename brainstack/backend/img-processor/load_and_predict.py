#!/usr/bin/env python3
"""
PlantDoc Model Inference Script
Usage: python load_and_predict.py <image_path>
"""

import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import json
import sys
from pathlib import Path

class PlantDocPredictor:
    def __init__(self, model_path='plantdoc_model_complete.pth'):
        """Initialize predictor with trained model"""
        
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {self.device}")
        
        # Load checkpoint
        print(f"Loading model from {model_path}...")
        checkpoint = torch.load(model_path, map_location=self.device)
        
        # Get class names
        self.class_names = checkpoint['class_names']
        self.num_classes = checkpoint['num_classes']
        
        # Setup model
        self.model = models.resnet50(pretrained=False)
        self.model.fc = nn.Linear(self.model.fc.in_features, self.num_classes)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model = self.model.to(self.device)
        self.model.eval()
        
        print(f"✅ Model loaded! Classes: {self.num_classes}")
        print(f"✅ Best Validation Accuracy: {checkpoint['best_val_acc']:.2f}%")
        
        # Image preprocessing
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
    
    def predict(self, image_path, top_k=5):
        """Predict disease from image"""
        
        # Load image
        image = Image.open(image_path).convert('RGB')
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Predict
        with torch.no_grad():
            outputs = self.model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            top_probs, top_indices = torch.topk(probabilities, k=min(top_k, self.num_classes))
        
        # Format results
        results = []
        for prob, idx in zip(top_probs[0], top_indices[0]):
            results.append({
                'disease': self.class_names[idx.item()],
                'confidence': prob.item() * 100
            })
        
        return results
    
    def predict_and_display(self, image_path):
        """Predict and display results"""
        
        print(f"\n{'='*70}")
        print(f"Analyzing: {image_path}")
        print(f"{'='*70}\n")
        
        results = self.predict(image_path)
        
        print("🎯 Prediction Results:")
        print(f"\n🏆 Top Prediction: {results[0]['disease']}")
        print(f"📊 Confidence: {results[0]['confidence']:.2f}%")
        
        print("\n📋 All Predictions:")
        for i, result in enumerate(results, 1):
            print(f"  {i}. {result['disease']}: {result['confidence']:.2f}%")
        
        print(f"\n{'='*70}\n")
        
        return results

def main():
    """Main function"""
    
    if len(sys.argv) < 2:
        print("Usage: python load_and_predict.py <image_path>")
        print("Example: python load_and_predict.py tomato_leaf.jpg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not Path(image_path).exists():
        print(f"❌ Error: Image not found: {image_path}")
        sys.exit(1)
    
    # Initialize predictor
    predictor = PlantDocPredictor()
    
    # Predict
    predictor.predict_and_display(image_path)

if __name__ == "__main__":
    main()

print("✅ Inference script created: load_and_predict.py")
